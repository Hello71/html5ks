#!/bin/sh
exec nginx -p `dirname $0` -c nginx.conf
