#!/bin/sh

set -e -x

MAKEOPTS="-j`nproc`"

case "$1" in
  before_install)
    sudo apt-get update -q

    curl -L http://downloads.sourceforge.net/project/opencore-amr/fdk-aac/fdk-aac-0.1.3.tar.gz | tar -xz
    curl http://downloads.xiph.org/releases/opus/opus-1.1.tar.gz | tar -xz
    curl http://ffmpeg.org/releases/ffmpeg-snapshot.tar.bz2 | tar -xj
    curl https://webp.googlecode.com/files/libwebp-0.4.0.tar.gz | tar -xz

    curl http://dl.katawa-shoujo.com/gold_1.1/%5B4ls%5D_katawa_shoujo_1.1-%5Blinux-x86%5D%5BB5C707D5%5D.tar.bz2 | tar -xj --strip-components 2 --wildcards "Katawa Shoujo-linux-x86/game/script-a*" "Katawa Shoujo-linux-x86/game/imachine.rpyc" "Katawa Shoujo-linux-x86/game/ui-strings.rpyc" "Katawa Shoujo-linux-x86/game/ui-strings_FR.rpyc" "Katawa Shoujo-linux-x86/game/data.rpa"
    mv *.rpyc unrpyc
    ;;
  install)
    sudo apt-get install -q libjpeg-progs libtheora-dev libvpx-dev libx264-dev npm webp yasm

    sudo npm install -g grunt-cli uglifyjs

    cd fdk-aac-0.1.3
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

    cd libwebp-0.4.0
    ./configure
    make $MAKEOPTS
    sudo make install
    cd ..

    curl https://raw.github.com/Lattyware/unrpa/master/unrpa | python2 - -p www/dump -m data.rpa
    rm data.rpa
    ;;
  script)
    exec ./setup.sh "$@"
    ;;
  *)
    exit 1
esac
