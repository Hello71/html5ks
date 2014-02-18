#!/bin/sh

if [ -z $MAKEOPTS ]; then
  MAKEOPTS="-j`nproc`"
fi

set -e -x

cd $(dirname $0)

cd unrpyc
make $MAKEOPTS install || true
cd ..

make $MAKEOPTS
