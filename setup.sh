#!/bin/bash

set -e -x

cd $(dirname $0)

check-reqs_no() {
}

check-reqs_disk() {
    local space

    space=$(df -P . 2>/dev/null | awk 'FNR == 2 {print $4}')

    if [[ $? == 0 && -n $space && $space -lt $1 ]] ; then
        echo >&2 "Warning: There is NOT at least $1 KiB disk space available, build may fail."
    fi
}

check-reqs_memory() {
    local actual_memory

    if [[ -r /proc/meminfo ]] ; then
        actual_memory=$(awk '/MemTotal/ { print $2 }' /proc/meminfo)
    fi
    if [[ -n $actual_memory && $actual_memory -lt $((1024 * $1)) ]] ; then
        echo >&2 "Warning: There is NOT at least $1 KiB RAM available, build may fail."
        echo >&2 "If it does, try setting MAKEOPTS lower or simply re-running this script."
    fi
}

if ! grep -q -- -j <<< "$MAKEOPTS"; then
  NPROC="`nproc`"
  MAKEOPTS="-j$NPROC $MAKEOPTS"
  echo >&2 "No -j detected, setting $MAKEOPTS automatically."
  check-reqs_memory $(( NPROC * 262144 )) # 256 MiB/job
  if [[ $NOTEMP ]]; then
    check-reqs_disk 500000 # 500 MiB
  else
    check-reqs_disk 13000000
    echo >&2 "If you have insufficient disk space (indicated if so above), consider setting NOTEMP=1 to disable generation of Y4M files."
  fi
fi

cd unrpyc
# silence build failure
make $MAKEOPTS install || true
cd ..

make $MAKEOPTS
