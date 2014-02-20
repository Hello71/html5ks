#!/bin/sh

if [ -z $MAKEOPTS ]; then
  MAKEOPTS="-j`nproc`"
  echo "No MAKEOPTS specified, setting $MAKEOPTS automatically."
  printf "%sGiB free RAM, approx 1GiB/core required (depending on ffmpeg settings)." "$(free -gt | tail -n 1 | awk '{print $4}')"
fi

set -e -x

cd $(dirname $0)

cd unrpyc
make $MAKEOPTS install || true
cd ..

make $MAKEOPTS
