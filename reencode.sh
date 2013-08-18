#!/bin/bash

export THREADS=${THREADS:-4}

cd $(dirname $0)
./vencode.sh
./iencode.sh
