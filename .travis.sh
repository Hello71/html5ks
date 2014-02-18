#!/bin/bash

MAKEOPTS="-j$(nproc)"

case "$1" in
  before_install)
    sudo apt-get update -qq
    sudo apt-get install -qq git

    git clone --depth 1 git://source.ffmpeg.org/ffmpeg
    git clone --depth 1 git://git.code.sf.net/p/opencore-amr/fdk-aac
    ;;
  install)
    sudo apt-get install -qq autoconf automake build-essential git imagemagick libjpeg-progs libopus0 libtheora-dev libtool libvpx-dev libx264-dev nodejs optipng pkg-config zlib1g-dev

    cd fdk-aac
    autoreconf -fiv
    ./configure --disable-shared
    make $MAKEOPTS
    sudo make install
    cd ..

    cd ffmpeg
    ./configure --disable-everything --disable-programs --disable-runtime-cpudetect --enable-decoder=mpeg4 --enable-decoder=pcm_s16le --enable-decoder=vorbis --enable-demuxer=matroska --enable-demuxer=ogg --enable-demuxer=wav --enable-encoder=huffyuv --enable-encoder=libfdk_aac --enable-encoder=libopus --enable-encoder=libtheora --enable-encoder=libvpx_vp8 --enable-encoder=libvpx_vp9 --enable-encoder=libx264 --enable-encoder=pcm_s16le --enable-encoder=rawvideo --enable-ffmpeg --enable-filter=aresample --enable-gpl --enable-hardcoded-tables --enable-libfdk_aac --enable-libopus --enable-libtheora --enable-libvpx --enable-libx264 --enable-muxer=ipod --enable-muxer=mp4 --enable-muxer=ogg --enable-muxer=wav --enable-muxer=webm --enable-muxer=yuv4mpegpipe --enable-nonfree --enable-protocol=file
    make $MAKEOPTS
    sudo make install
    cd ..
  script)
    exec ./setup.sh "$@"
esac
