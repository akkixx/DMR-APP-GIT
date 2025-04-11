/**
 * Service Worker Registration
 * Registers the service worker for offline functionality
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./js/service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

/**
 * Helper function to get the base URL of the application
 * Useful for constructing absolute URLs from relative paths
 */
function getBaseUrl() {
    const currentUrl = window.location.href;
    return currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
}

/**
 * Utility to convert relative URLs to absolute URLs
 * @param {string} relativePath - The relative path to convert
 * @returns {string} The absolute URL
 */
function getAbsoluteUrl(relativePath) {
    const base = getBaseUrl();
    // Remove any leading ./ from the relative path
    const cleanPath = relativePath.replace(/^\.\//, '');
    return base + cleanPath;
} 