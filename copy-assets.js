/**
 * Script to ensure web assets are correctly copied to Android assets folder
 */
const fs = require('fs');
const path = require('path');

// Define paths
const wwwDir = path.join(__dirname, 'www');
const androidAssetsDir = path.join(__dirname, 'android/app/src/main/assets/public');

console.log('Source directory:', wwwDir);
console.log('Destination directory:', androidAssetsDir);

// Create directory if it doesn't exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`Creating directory: ${directory}`);
    fs.mkdirSync(directory, { recursive: true });
  } else {
    console.log(`Directory already exists: ${directory}`);
  }
}

// Copy file from source to destination
function copyFile(source, destination) {
  try {
    const data = fs.readFileSync(source);
    fs.writeFileSync(destination, data);
    console.log(`Copied: ${source} -> ${destination}`);
  } catch (err) {
    console.error(`Error copying file ${source}: ${err.message}`);
  }
}

// Copy directory recursively
function copyDirectory(source, destination) {
  console.log(`Copying directory ${source} to ${destination}`);
  
  // Create destination directory
  ensureDirectoryExists(destination);
  
  // Read all items in source directory
  try {
    const items = fs.readdirSync(source, { withFileTypes: true });
    console.log(`Found ${items.length} items in ${source}`);
    
    // Process each item
    for (const item of items) {
      const sourcePath = path.join(source, item.name);
      const destPath = path.join(destination, item.name);
      
      if (item.isDirectory()) {
        // Recursive copy for directories
        console.log(`Found directory: ${item.name}`);
        copyDirectory(sourcePath, destPath);
      } else {
        // Copy file
        console.log(`Found file: ${item.name}`);
        copyFile(sourcePath, destPath);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${source}: ${err.message}`);
  }
}

// Main function
function main() {
  console.log('Starting to copy web assets to Android...');
  
  try {
    // Check if source directory exists
    if (!fs.existsSync(wwwDir)) {
      console.error(`Source directory does not exist: ${wwwDir}`);
      process.exit(1);
    }
    
    // Ensure Android assets directory exists
    ensureDirectoryExists(androidAssetsDir);
    
    // Copy all files from www directory to Android assets
    copyDirectory(wwwDir, androidAssetsDir);
    
    console.log('Successfully copied all web assets to Android assets folder.');
  } catch (err) {
    console.error(`Failed to copy assets: ${err.message}`);
    process.exit(1);
  }
}

// Execute main function
main(); 