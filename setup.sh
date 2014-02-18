#!/bin/sh

set -e

cd $(dirname $0)

cd unrpyc
make $MAKEOPTS install || true
cd ..

make $MAKEOPTS
