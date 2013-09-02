#!/bin/bash

# configure ffmpeg location if not in PATH
FFMPEG=ffmpeg
# configure flags
FFMPEG_FLAGS=""

set -e

ffmpeg() {
  set -x
  command ${FFMPEG} -threads ${THREADS} ${FFMPEG_FLAGS} "$@"
  set +x
}

for d in bgm sfx; do
  pushd $(dirname $0)/www/dump/${d}
  for f in *.ogg; do
    OUT=${f%.ogg}
    [[ -f ${OUT}.wav ]] || ffmpeg -i $f -c:a pcm_s16le ${OUT}.wav
    [[ -f ${OUT}.opus ]] || opusenc --bitrate 64 ${OUT}.wav ${OUT}.opus
    [[ -f ${OUT}.m4a ]] || ffmpeg -i ${OUT}.wav -c:a libfdk_aac -vbr 2 ${OUT}.m4a
  done
  popd
done
