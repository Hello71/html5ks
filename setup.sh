#!/bin/bash

set -e

cd $(dirname $0)

git submodule update --init

pushd unrpyc
make ${MAKEOPTS} install
popd

make ${MAKEOPTS}
