#!/bin/bash

if ! grep -q -- -j <<< "$MAKEOPTS"; then
  MAKEOPTS="-j`nproc` $MAKEOPTS"
  echo "No -j detected, setting $MAKEOPTS automatically."
  printf "%sGiB free RAM, approx 1GiB/core required (depending on ffmpeg settings)." "$(free -gt | tail -n 1 | awk '{print $4}')"
fi

set -e -x

cd $(dirname $0)

cd unrpyc
# silence build failure
make $MAKEOPTS install || true
cd ..

make $MAKEOPTS
