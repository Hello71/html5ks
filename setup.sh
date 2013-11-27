#!/bin/bash

cd $(dirname $0)

git submodule update --init

pushd unrpyc
make install
popd

trim() {
  convert -trim "$@" "$@"
  optipng -o7 "$@"
}

trim www/dump/ui/bt-cf-unchecked.png
trim www/dump/ui/bt-cf-checked.png

make

convert www/dump/ui/icon.png -resize 256x256 -transparent white www/favicon.ico
