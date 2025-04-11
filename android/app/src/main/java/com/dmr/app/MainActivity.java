package com.dmr.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.util.Log;
import android.os.Handler;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Bridge;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "DMRMainActivity";
    private static final int LOADING_TIMEOUT = 10000; // 10 seconds timeout
    private Handler timeoutHandler;
    private boolean pageLoaded = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        timeoutHandler = new Handler();
        setupWebView();
    }

    private void setupWebView() {
        WebView webView = bridge.getWebView();
        WebSettings settings = webView.getSettings();
        
        // Enable DOM storage for localStorage
        settings.setDomStorageEnabled(true);
        
        // Enable local file access permissions
        settings.setAllowFileAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        
        // Enable JavaScript
        settings.setJavaScriptEnabled(true);
        
        // Disable cache for development
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        
        // Set appropriate mixed content mode
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        
        // Enable debugging
        settings.setAppCacheEnabled(true);
        settings.setDatabaseEnabled(true);
        
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                Log.d(TAG, "Page started loading: " + url);
                pageLoaded = false;
                
                // Set a timeout for loading
                timeoutHandler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        if (!pageLoaded) {
                            Log.e(TAG, "Page load timeout for URL: " + url);
                            showErrorPage(view, "Loading timeout. Please check your connection and try again.");
                        }
                    }
                }, LOADING_TIMEOUT);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                String errorMsg = "Error: " + error.getDescription();
                Log.e(TAG, "WebView Error: " + errorMsg + " URL: " + request.getUrl());
                showErrorPage(view, errorMsg);
            }
            
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                Log.d(TAG, "Loading URL: " + url);
                return false;
            }
            
            @Override
            public void onPageFinished(WebView view, String url) {
                Log.d(TAG, "Page finished loading: " + url);
                pageLoaded = true;
                timeoutHandler.removeCallbacksAndMessages(null);
                super.onPageFinished(view, url);
                
                // Inject JavaScript to check if the page is actually loaded
                view.evaluateJavascript(
                    "(function() { return document.body.innerHTML.length; })();",
                    value -> {
                        if (value != null && value.equals("0")) {
                            Log.e(TAG, "Page loaded but appears to be empty");
                            showErrorPage(view, "Page loaded but appears to be empty. Please check the content.");
                        }
                    }
                );
            }
        });

        try {
            // First try to load from assets/public folder
            String mainPath = "file:///android_asset/public/index.html";
            Log.d(TAG, "Attempting to load main page from: " + mainPath);
            webView.loadUrl(mainPath);
        } catch (Exception e) {
            Log.e(TAG, "Error loading main page", e);
            showErrorPage(webView, "Unable to load app content. Error: " + e.getMessage());
        }
    }

    private void showErrorPage(WebView webView, String errorMessage) {
        String errorHtml = "<html><body style='background-color: #f8f9fa; font-family: Arial, sans-serif;'>" +
                          "<div style='padding: 20px; text-align: center;'>" +
                          "<h2 style='color: #dc3545;'>Loading Error</h2>" +
                          "<p style='color: #6c757d;'>" + errorMessage + "</p>" +
                          "<button onclick='window.location.reload()' style='padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px;'>Retry</button>" +
                          "</div></body></html>";
        webView.loadData(errorHtml, "text/html", "UTF-8");
    }
}
