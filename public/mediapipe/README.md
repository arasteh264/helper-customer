# MediaPipe local assets

This project keeps the MediaPipe runtime and model files on the same host as the app, instead of loading them from a public CDN.

## Files to place in this folder

Download the official task files to `public/mediapipe/`:

- `face_detection_short_range.tflite`
- `selfie_segmentation_landscape.tflite`
- `vision_wasm_internal.js`
- `vision_wasm_internal.wasm`
- `vision_wasm_internal.worker.mjs` (if published by your chosen version)

Then point `FilesetResolver.forVisionTasks("/mediapipe", true)` to this folder.

## Recommended source

Use the official MediaPipe task assets from the package maintainers:

- https://storage.googleapis.com/mediapipe-models/
- https://ai.google.dev/edge/mediapipe/solutions

The app must not request these files from a third-party CDN in production. Keep them under the app's own `public/` directory so users in Iran can load them reliably and without CORS issues.

## Local script

A helper script is available at `scripts/download-mediapipe-assets.mjs` to fetch the official model files into this directory.
