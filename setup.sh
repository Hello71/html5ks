#!/bin/bash

set -e

cd $(dirname $0)

git submodule update --init

pushd unrpyc
make install
popd

trim() {
  for f in "$@"; do
    convert -trim "$f" "$f"
  done
  optipng -o7 "$@"
}

trim www/dump/ui/bt-cf-unchecked.png www/dump/ui/bt-cf-checked.png

make ${MAKEOPTS}
