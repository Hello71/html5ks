#!/bin/sh

set -e -x

case "$1" in
  before_install)
    sudo service postgresql stop
    sudo service mysql stop
    sudo apt-get update -qq

    curl http://nodejs.org/dist/node-latest.tar.gz | tar -xz
    curl https://webp.googlecode.com/files/libwebp-0.4.0.tar.gz | tar -xz
    curl -L http://downloads.sourceforge.net/project/opencore-amr/fdk-aac/fdk-aac-0.1.3.tar.gz | tar -xz
    curl http://downloads.xiph.org/releases/opus/opus-1.1.tar.gz | tar -xz
    curl http://webm.googlecode.com/files/libvpx-v1.3.0.tar.bz2 | tar -xj
    curl http://ffmpeg.org/releases/ffmpeg-snapshot.tar.bz2 | tar -xj
    curl -L http://downloads.sourceforge.net/project/apngasm/2.7/apngasm-2.7-src.zip -O
    unzip apngasm-2.7-src.zip apngasm.c

    curl http://dl.katawa-shoujo.com/gold_1.1/%5B4ls%5D_katawa_shoujo_1.1-%5Blinux-x86%5D%5BB5C707D5%5D.tar.bz2 | tar -xj --strip-components 2 --wildcards "Katawa Shoujo-linux-x86/game/script-a*.rpyc" "Katawa Shoujo-linux-x86/game/imachine.rpyc" "Katawa Shoujo-linux-x86/game/ui-strings*.rpyc" "Katawa Shoujo-linux-x86/game/data.rpa"
    mv *.rpyc unrpyc

    npm config set tmp /tmp

    ;;
  install)
    MAKEOPTS="-s ${MAKEOPTS}"
    sudo apt-get install -qq libtheora-dev libx264-dev yasm

    cd libwebp-0.4.0
    sed -i -e '/unset ac_cv_header_GL_glut_h/d' configure
    ac_cv_header_gif_lib_h=no \
    ac_cv_header_tiffio_h=no \
    ac_cv_header_GL_glut_h=no \
    ./configure --disable-shared --disable-dependency-tracking --enable-libwebpmux --quiet
    make $MAKEOPTS >/dev/null
    sudo make $MAKEOPTS install >/dev/null
    cd ..

    cd node-v*
    ./configure --openssl-use-sys --shared-zlib
    make $MAKEOPTS >/dev/null
    sudo python tools/install.py install >/dev/null
    cd ..

    sudo npm install -g uglify-js

    cd fdk-aac-0.1.3
    ./configure --disable-shared --disable-dependency-tracking --quiet
    make $MAKEOPTS >/dev/null
    sudo make $MAKEOPTS install >/dev/null
    cd ..

    cd opus-1.1
    ./configure --disable-shared --disable-extra-programs --disable-dependency-tracking --quiet
    make $MAKEOPTS >/dev/null
    sudo make $MAKEOPTS install >/dev/null
    cd ..

    cd libvpx-v1.3.0
    ./configure
    make $MAKEOPTS >/dev/null
    sudo make $MAKEOPTS install >/dev/null
    cd ..

    patch -p0 <<EOF
--- apngasm.c
+++ apngasm.c
@@ -29,6 +29,7 @@
  */
 #include <stdio.h>
 #include <stdlib.h>
+#include <string.h>
 #include "png.h"     /* original (unpatched) libpng is ok */
 #include "zlib.h"
 
EOF
    make LDLIBS="$(pkg-config --libs libpng --libs zlib)" apngasm
    install -c -m755 apngasm /usr/local/bin

    cd ffmpeg
    ./configure --disable-everything --disable-logging --disable-programs --disable-runtime-cpudetect --enable-decoder=mpeg4 --enable-decoder=pcm_s16le --enable-decoder=vorbis --enable-decoder=rawvideo --enable-demuxer=matroska --enable-demuxer=ogg --enable-demuxer=wav --enable-demuxer=yuv4mpegpipe --enable-encoder=libfdk_aac --enable-encoder=libopus --enable-encoder=libtheora --enable-encoder=libvpx_vp8 --enable-encoder=libvpx_vp9 --enable-encoder=libx264 --enable-encoder=pcm_s16le --enable-encoder=rawvideo --enable-ffmpeg --enable-filter=aresample --enable-gpl --enable-hardcoded-tables --enable-libfdk_aac --enable-libopus --enable-libtheora --enable-libvpx --enable-libx264 --enable-muxer=ipod --enable-muxer=mp4 --enable-muxer=ogg --enable-muxer=wav --enable-muxer=webm --enable-muxer=yuv4mpegpipe --enable-nonfree --enable-protocol=file
    make $MAKEOPTS >/dev/null
    sudo make $MAKEOPTS install >/dev/null
    cd ..

    curl https://raw.github.com/Lattyware/unrpa/master/unrpa | python2 - -p www/dump -m data.rpa
    rm data.rpa
    ;;
  script)
    exec make $MAKEOPTS
    ;;
  *)
    exit 1
esac
