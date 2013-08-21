#!/bin/sh
if command -v zopfli; then
  printf "%s" "$(command -v zopfli)"
elif command -v gzip; then
  echo >&2 "Consider obtaining zopfli (https://code.google.com/p/zopfli/)"
  echo >&2 "for higher compression ratios (about 5% decrease in size of"
  echo >&2 "script.json.gz)."
  printf "%s" "$(command -v gzip) -9"
else
  echo >&2 "Could not find zopfli or gzip, aborting."
  exit 1
fi
