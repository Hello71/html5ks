#!/bin/bash
# configure ffmpeg location if not in PATH
FFMPEG=ffmpeg
# configure flags (e.g. if you want to force high -threads)
FFMPEG_FLAGS=""

set -e
FFMPEG_FLAGS+="$@"
cd $(dirname $0)/www/dump/video

encode() {
  set -x
  ${FFMPEG} -i "$1" -c:v "$2" $3 ${FFMPEG_FLAGS} "$4"
}

for f in *.mkv; do
  OUT=${f%.mkv}
  encode $f libx264 "-preset slower -tune animation" ${OUT}.mp4
  encode $f libvpx "-crf 15 -b:v 1M -an -f webm -y" /dev/null
  encode $f libvpx "-crf 15 -b:v 1M -c:a libvorbis" ${OUT}.webm
  encode $f libtheora "-qscale:v 6 -c:a libvorbis" ${OUT}.ogg
done
