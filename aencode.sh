#!/bin/bash

# configure ffmpeg location if not in PATH
FFMPEG=ffmpeg
# configure flags
FFMPEG_FLAGS=""

set -e

aencode() {
  set -x
  [[ -f $4 ]] || ${FFMPEG} -threads ${THREADS} -i "$1" -c:a "$2" $3 ${FFMPEG_FLAGS} "$4"
}

for d in bgm sfx; do
  cd $(dirname $0)/www/dump/${d}
  for f in *.ogg; do
    OUT=${f%.ogg}
    aencode $f libopus "-b:a 48k -vbr on" ${OUT}.opus
    aencode $f libfdk_aac -vbr 2 ${OUT}.m4a
  done
done
