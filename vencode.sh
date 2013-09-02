#!/bin/bash

# configure ffmpeg location if not in PATH
FFMPEG=ffmpeg
# configure flags
FFMPEG_FLAGS=""

set -e

cd $(dirname $0)/www/dump/video

ffmpeg() {
  set -x
  command ${FFMPEG} -n -threads ${THREADS} ${FFMPEG_FLAGS} "$@"
  set +x
}

for f in *.mkv; do
  OUT=${f%.mkv}
  ffmpeg -i $f -c:v libx264 -preset slower -tune animation -c:a libfdk_aac ${OUT}.mp4
  ffmpeg -i $f -c:v libvpx -crf 15 -b:v 1M -c:a copy ${OUT}.webm
  ffmpeg -i $f -c:v libtheora -qscale:v 6 -c:a copy ${OUT}.ogv
done
