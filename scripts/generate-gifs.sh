#!/usr/bin/env bash
set -euo pipefail

# Usage: place mp4 files in assets/videos/ai-dashboard/ then run this script from repository root
# Requires: ffmpeg, gifsicle (optional to optimize)

INPUT_DIR="assets/videos/ai-dashboard"
OUT_DIR="public/images/ai-dashboard"
TMP_DIR=".tmp_gif"

mkdir -p "$INPUT_DIR" "$OUT_DIR" "$TMP_DIR"

FILES=(
  "ai-dashboard-executive-summary.mp4"
  "ai-dashboard-HITL.mp4"
  "ai-dashboard-loading.mp4"
  "ai-dashboard-planning.mp4"
  "ai-dashboard-policy-diff.mp4"
  "ai-dashboard-scrolling.mp4"
  "ai-dashboard-sidecar-start-plan.mp4"
)

for f in "${FILES[@]}"; do
  infile="$INPUT_DIR/$f"
  base="${f%.*}"
  thumb="$OUT_DIR/${base}.jpg"
  gif="$OUT_DIR/${base}.gif"
  palette="$TMP_DIR/${base}_palette.png"
  tmpgif="$TMP_DIR/${base}_tmp.gif"

  if [ ! -f "$infile" ]; then
    echo "Skipping $infile - file not found."
    continue
  fi

  echo "Generating thumbnail for $infile -> $thumb"
  ffmpeg -y -i "$infile" -vf "select=gte(n\,10),scale=1280:-2" -vframes 1 "$thumb"

  echo "Generating optimized GIF for $infile -> $gif"
  # Generate palette for better colors
  ffmpeg -y -ss 0 -t 6 -i "$infile" -vf "fps=15,scale=720:-2:flags=lanczos,palettegen" "$palette"
  ffmpeg -y -ss 0 -t 6 -i "$infile" -i "$palette" -filter_complex "fps=15,scale=720:-2:flags=lanczos[x];[x][1:v]paletteuse" -loop 0 "$tmpgif"

  # Optional optimization with gifsicle if available
  if command -v gifsicle >/dev/null 2>&1; then
    gifsicle -O3 "$tmpgif" -o "$gif"
    rm -f "$tmpgif"
  else
    mv "$tmpgif" "$gif"
  fi

  echo "Created: $thumb and $gif"
done

rm -rf "$TMP_DIR"
echo "Done. Place generated images in public/images/ai-dashboard/ if they aren't already visible in your dev server."