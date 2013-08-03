#!/bin/sh
cd "`dirname $0`"
# empty file
> nginx.gen.conf
if nginx -V 2>&1 | grep -q -- --with-http_gzip_static_module; then
  echo "gzip_static on" >> nginx.gen.conf
fi
exec nginx -p "$PWD" -c nginx.conf
