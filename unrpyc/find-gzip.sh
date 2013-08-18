#!/bin/sh
ZOPFLI="$(command -v zopfli)"
GZIP="$(command -v gzip)"
if [ -n $ZOPFLI ]; then
  echo "$ZOPFLI"
elif [ -n $GZIP ]; then
  echo "$GZIP -9"
else
  exit 1
fi
