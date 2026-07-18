Place the original MP4 files (the ones you attached) into `assets/videos/ai-dashboard/` then run the provided script to generate JPG thumbnails and GIFs.

Steps:

1. Copy your mp4 files into `assets/videos/ai-dashboard/` with these names (or update the script):
   - ai-dashboard-executive-summary.mp4
   - ai-dashboard-HITL.mp4
   - ai-dashboard-loading.mp4
   - ai-dashboard-planning.mp4
   - ai-dashboard-policy-diff.mp4
   - ai-dashboard-scrolling.mp4
   - ai-dashboard-sidecar-start-plan.mp4

2. Make the script executable and run it from repository root:

```bash
chmod +x scripts/generate-gifs.sh
./scripts/generate-gifs.sh
```

3. The script writes outputs to `public/images/ai-dashboard/`:
   - `*.jpg` thumbnails
   - `*.gif` animated previews

Notes:
- The script requires `ffmpeg`. Install via `brew install ffmpeg` on macOS.
- Optional: install `gifsicle` to further optimize GIFs: `brew install gifsicle`.
- If you prefer MP4/WebM previews instead of GIFs (better quality and smaller size), consider converting to short WebM clips instead and updating the MDX references.
