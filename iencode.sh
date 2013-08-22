#!/bin/bash

# configure cwebp location if not in PATH
CWEBP=cwebp
# configure flags
CWEBP_FLAGS="-m 6"

cd $(dirname $0)/www/dump

iencode() {
  EXT="$1"
  QUAL="$2"
  export EXT QUAL CWEBP CWEBP_FLAGS
  set -x
  find . -name \*."${EXT}" -print0 | xargs -0 -P ${THREADS} -n 1 bash -c '
    IN="$0"
    OUT="${IN%.${EXT}}.webp"
    ${CWEBP} -q "${QUAL}" ${CWEBP_FLAGS} ${IN} -o ${OUT}
  '
}

iencode jpg 90
iencode png 99
