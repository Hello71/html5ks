#!/bin/bash

# configure ffmpeg location if not in PATH
FFMPEG=ffmpeg
# configure flags
FFMPEG_FLAGS="-y"

set -e

cd $(dirname $0)/www/dump/video

vencode() {
  set -x
  ${FFMPEG} -threads ${THREADS} -i "$1" -c:v "$2" $3 ${FFMPEG_FLAGS} "$4"
}

for f in *.mkv; do
  OUT=${f%.mkv}
  vencode $f libx264 "-preset slower -tune animation" ${OUT}.mp4
  vencode $f libvpx "-crf 15 -b:v 1M -an -f webm -y" /dev/null
  vencode $f libvpx "-crf 15 -b:v 1M -c:a copy" ${OUT}.webm
  vencode $f libtheora "-qscale:v 6 -c:a copy" ${OUT}.ogg
done

