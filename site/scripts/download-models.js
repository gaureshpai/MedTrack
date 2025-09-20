#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'models');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'gesture_recognizer.task');

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading model from: ${url}`);
    console.log(`Output path: ${outputPath}`);
    
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Download failed with status code: ${response.statusCode}`));
        return;
      }
      
      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloadedSize = 0;
      
      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        const progress = ((downloadedSize / totalSize) * 100).toFixed(1);
        process.stdout.write(`\rProgress: ${progress}% (${downloadedSize}/${totalSize} bytes)`);
      });
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`\nDownload completed! Model saved to: ${outputPath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

async function main() {
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`Created directory: ${OUTPUT_DIR}`);
    }
    
    // Check if file already exists
    if (fs.existsSync(OUTPUT_FILE)) {
      const stats = fs.statSync(OUTPUT_FILE);
      console.log(`Model file already exists (${stats.size} bytes): ${OUTPUT_FILE}`);
      console.log('Delete the file and run this script again to re-download.');
      return;
    }
    
    await downloadFile(MODEL_URL, OUTPUT_FILE);
    
    // Verify the downloaded file
    const stats = fs.statSync(OUTPUT_FILE);
    console.log(`File size: ${stats.size} bytes`);
    
    if (stats.size < 1000000) { // Less than 1MB indicates an error
      throw new Error('Downloaded file is too small, probably an error page');
    }
    
    console.log('✅ MediaPipe gesture recognition model downloaded successfully!');
    console.log('🚀 You can now use the sign language search feature.');
    
  } catch (error) {
    console.error('❌ Error downloading model:', error.message);
    console.log('\n💡 Alternative setup:');
    console.log('1. Manually download from:');
    console.log('   https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task');
    console.log('2. Save it as: public/models/gesture_recognizer.task');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { downloadFile };
