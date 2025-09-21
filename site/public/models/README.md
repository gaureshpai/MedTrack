# MediaPipe Gesture Recognition Models

This directory should contain the gesture recognition model files for sign language detection.

## Required Files

1. **gesture_recognizer.task** - MediaPipe gesture recognition model
   - Download from: https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task
   - Size: ~10MB
   - Place this file in the `/public/models/` directory

## Setup Instructions

1. Create the models directory:
   ```bash
   mkdir -p public/models
   ```

2. Download the model file:
   ```bash
   curl -o public/models/gesture_recognizer.task https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task
   ```

3. Verify the file is downloaded:
   ```bash
   ls -la public/models/
   ```

## Alternative Setup

If the automatic CDN loading fails, the app will fallback to loading the model from this local directory.

## Supported Gestures

The current model supports:
- ASL alphabet letters (A-Z)
- Basic gestures (thumbs up, thumbs down, OK, victory, etc.)
- Custom mappings for search functionality

## Browser Requirements

- Modern browser with WebAssembly support
- Camera access permissions
- HTTPS connection (required for camera access)
