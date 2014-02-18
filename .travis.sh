#!/bin/sh

set -e -x

MAKEOPTS="-j`nproc`"

case "$1" in
  before_install)
    sudo apt-get update -q

    curl -L http://downloads.sourceforge.net/project/opencore-amr/fdk-aac/fdk-aac-0.1.3.tar.gz | tar -xz
    curl http://downloads.xiph.org/releases/opus/opus-1.1.tar.gz | tar -xz
    curl http://ffmpeg.org/releases/ffmpeg-snapshot.tar.bz2 | tar -xj
    curl http://dl.katawa-shoujo.com/gold_1.1/%5B4ls%5D_katawa_shoujo_1.1-%5Blinux-x86%5D%5BB5C707D5%5D.tar.bz2 | tar -xj "Katawa Shoujo-linux-x86/game/imachine_replay.rpyc" "Katawa Shoujo-linux-x86/game/imachine.rpyc" "Katawa Shoujo-linux-x86/game/script-a1-friday_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a1-friday.rpyc" "Katawa Shoujo-linux-x86/game/script-a1-monday_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a1-monday.rpyc" "Katawa Shoujo-linux-x86/game/script-a1-saturday_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a1-saturday.rpyc" "Katawa Shoujo-linux-x86/game/script-a1-sunday_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a1-sunday.rpyc" "Katawa Shoujo-linux-x86/game/script-a1-thursday_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a1-thursday.rpyc" "Katawa Shoujo-linux-x86/game/script-a1-tuesday_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a1-tuesday.rpyc" "Katawa Shoujo-linux-x86/game/script-a1-wednesday_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a1-wednesday.rpyc" "Katawa Shoujo-linux-x86/game/script-a2-emi_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a2-emi.rpyc" "Katawa Shoujo-linux-x86/game/script-a2-hanako_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a2-hanako.rpyc" "Katawa Shoujo-linux-x86/game/script-a2-lilly_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a2-lilly.rpyc" "Katawa Shoujo-linux-x86/game/script-a2-rin_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a2-rin.rpyc" "Katawa Shoujo-linux-x86/game/script-a2-shizune_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a2-shizune.rpyc" "Katawa Shoujo-linux-x86/game/script-a3-emi_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a3-emi.rpyc" "Katawa Shoujo-linux-x86/game/script-a3-hanako_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a3-hanako.rpyc" "Katawa Shoujo-linux-x86/game/script-a3-lilly_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a3-lilly.rpyc" "Katawa Shoujo-linux-x86/game/script-a3-rin_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a3-rin.rpyc" "Katawa Shoujo-linux-x86/game/script-a3-shizune_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a3-shizune.rpyc" "Katawa Shoujo-linux-x86/game/script-a4-emi_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a4-emi.rpyc" "Katawa Shoujo-linux-x86/game/script-a4-hanako_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a4-hanako.rpyc" "Katawa Shoujo-linux-x86/game/script-a4-lilly_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a4-lilly.rpyc" "Katawa Shoujo-linux-x86/game/script-a4-rin_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a4-rin.rpyc" "Katawa Shoujo-linux-x86/game/script-a4-shizune_FR.rpyc" "Katawa Shoujo-linux-x86/game/script-a4-shizune.rpyc" "Katawa Shoujo-linux-x86/game/script_version.rpyc" "Katawa Shoujo-linux-x86/game/ui_code.rpyc" "Katawa Shoujo-linux-x86/game/_ui_early.rpyc" "Katawa Shoujo-linux-x86/game/ui_i18n.rpyc" "Katawa Shoujo-linux-x86/game/ui_ingamemenu.rpyc" "Katawa Shoujo-linux-x86/game/ui_labels.rpyc" "Katawa Shoujo-linux-x86/game/ui_settings.rpyc" "Katawa Shoujo-linux-x86/game/ui-strings_FR.rpyc" "Katawa Shoujo-linux-x86/game/ui-strings.rpyc" "Katawa Shoujo-linux-x86/game/data.rpa"
    ;;
  install)
    sudo apt-get install -q autoconf automake build-essential git imagemagick libjpeg-progs libtheora-dev libtool libvpx-dev libx264-dev optipng pkg-config yasm zlib1g-dev

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
    ;;
  script)
    exec ./setup.sh "$@"
    ;;
  *)
    exit 1
esac
