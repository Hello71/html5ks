#!/bin/sh
ZOPFLI="$(command -v zopfli)"
GZIP="$(command -v gzip)"
if [ -n $ZOPFLI ]; then
  echo "$ZOPFLI"
elif [ -n $GZIP ]; then
  echo >&2 "Consider obtaining zopfli (https://code.google.com/p/zopfli/)"
  echo >&2 "for higher compression ratios (about 5% decrease in size of"
  echo >&2 "script.json.gz."
  echo "$GZIP -9"
else
  echo >&2 "Could not find zopfli or gzip, aborting."
  exit 1
fi
