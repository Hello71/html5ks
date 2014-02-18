#!/bin/bash

set -e

MAKEOPTS="-j$(nproc)"

case "$1" in
  before_install)
    sudo apt-get update -qq
    sudo apt-get install -qq git

    git clone --depth 1 git://git.code.sf.net/p/opencore-amr/fdk-aac
    wget http://downloads.xiph.org/releases/opus/opus-1.1.tar.gz
    tar -xf opus-1.1.tar.gz
    git clone --depth 1 git://source.ffmpeg.org/ffmpeg
    ;;
  install)
    sudo apt-get install -qq autoconf automake build-essential git imagemagick libjpeg-progs libtheora-dev libtool libvpx-dev libx264-dev optipng pkg-config yasm zlib1g-dev

    cd fdk-aac
    autoreconf -fiv
    ./configure --disable-shared
    make $MAKEOPTS
    sudo make install
    cd ..

    cd opus-1.1
    ./configure --disable-shared
    make $MAKEOPTS
    sudo make install
    cd ..

    cd ffmpeg
    ./configure --disable-everything --disable-programs --disable-runtime-cpudetect --enable-decoder=mpeg4 --enable-decoder=pcm_s16le --enable-decoder=vorbis --enable-demuxer=matroska --enable-demuxer=ogg --enable-demuxer=wav --enable-encoder=huffyuv --enable-encoder=libfdk_aac --enable-encoder=libopus --enable-encoder=libtheora --enable-encoder=libvpx_vp8 --enable-encoder=libvpx_vp9 --enable-encoder=libx264 --enable-encoder=pcm_s16le --enable-encoder=rawvideo --enable-ffmpeg --enable-filter=aresample --enable-gpl --enable-hardcoded-tables --enable-libfdk_aac --enable-libopus --enable-libtheora --enable-libvpx --enable-libx264 --enable-muxer=ipod --enable-muxer=mp4 --enable-muxer=ogg --enable-muxer=wav --enable-muxer=webm --enable-muxer=yuv4mpegpipe --enable-nonfree --enable-protocol=file
    make $MAKEOPTS
    sudo make install
    cd ..
    ;;
  script)
    exec ./setup.sh "$@"
    ;;
  *)
    exit 1
esac
