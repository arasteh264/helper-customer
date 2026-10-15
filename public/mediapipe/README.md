# MediaPipe local assets

This project keeps the MediaPipe runtime and model files on the same host as the app, instead of loading them from a public CDN.

## Files to place in this folder

Run `node scripts/download-mediapipe-assets.mjs` from the repository root to
download the official models and copy the installed MediaPipe runtime to
`public/mediapipe/`:

- `blaze_face_short_range.tflite`
- `selfie_segmenter.tflite`
- `vision_wasm_module_internal.js`
- `vision_wasm_module_internal.wasm`

The script downloads model files from the official MediaPipe model storage and
copies wasm files from the installed `@mediapipe/tasks-vision` package. The app
loads all of them from its own origin through
`FilesetResolver.forVisionTasks("/mediapipe", true)`.

## Recommended source

Use the official MediaPipe task assets from the package maintainers:

- https://storage.googleapis.com/mediapipe-models/
- https://ai.google.dev/edge/mediapipe/solutions

The app must not request these files from a third-party CDN in production. Keep them under the app's own `public/` directory so users in Iran can load them reliably and without CORS issues.

## Local script

A helper script is available at `scripts/download-mediapipe-assets.mjs`.
