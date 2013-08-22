#!/bin/bash

export THREADS=${THREADS:-$(nproc)}

cd $(dirname $0)
./vencode.sh

trim() {
  convert -trim "$@" "$@"
}

trim www/dump/ui/bt-cf-unchecked.png
trim www/dump/ui/bt-cf-checked.png

./iencode.sh
