#!/bin/bash

set -e
cd "$(dirname $0)"


# empty file
> nginx.gen.conf


V=$(nginx -V 2>&1)

if echo ${V} | grep -q -- --with-http_gzip_static_module; then
  echo "gzip_static on;" >> nginx.gen.conf
else
  echo >&2 "The gzip_static module for nginx is highly recommended to reduce server load and utilize zopfli's higher compression ratio."
fi

if ! echo ${V} | grep -q -- --without-http_proxy_module; then
  echo "proxy_temp_path /dev/null;" >> nginx.gen.conf
fi

if ! echo ${V} | grep -q -- --without-http_fastcgi_module; then
  echo "fastcgi_temp_path /dev/null;" >> nginx.gen.conf
fi

if ! echo ${V} | grep -q -- --without-http_scgi_module; then
  echo "scgi_temp_path /dev/null;" >> nginx.gen.conf
fi

if ! echo ${V} | grep -q -- --without-http_uwsgi_module; then
  echo "uwsgi_temp_path /dev/null;" >> nginx.gen.conf
fi


exec nginx -p "$PWD" -c nginx.conf
