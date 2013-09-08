#!/bin/bash

export THREADS=${THREADS:-$(nproc)}

cd $(dirname $0)

git submodule update --init

pushd unrpyc
make install
popd

./vencode.sh

trim() {
  convert -trim "$@" "$@"
  optipng -o7 "$@"
}

trim www/dump/ui/bt-cf-unchecked.png
trim www/dump/ui/bt-cf-checked.png

./iencode.sh
./aencode.sh
