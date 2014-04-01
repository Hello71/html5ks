#!/usr/bin/env python3

import os
import re
import shlex
import shutil
import subprocess
from sys import stderr

cmds = {}

class CheckError(Exception):
    pass

def checking(thing):
    stderr.write("checking %s... " % thing)
    stderr.flush()

def check(name, flags=[], optional=False, var=None, run=True):
    checking("for %s" % name)
    var = var or name.upper()
    split = shlex.split(os.getenv(var) or name)
    exe = shutil.which(split[0])
    if not exe:
        stderr.write("not found\n")
        if not optional:
            raise CheckError()
    stderr.write("%s\n" % exe)
    cmd = [exe] + split[1:] + flags + shlex.split(os.getenv(var + "FLAGS") or "")
    if run:
        checking("%s usability" % exe)
        try:
            subprocess.check_call(cmd + ["-h"], stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
            stderr.write("yes\n")
        except subprocess.CalledProcessError as e:
            raise CheckError() from e

    cmds[var] = cmd
    return cmd

def run_ffmpeg(arg):
    return subprocess.check_output(ffmpeg + [arg], stderr=subprocess.STDOUT).decode('utf-8')

def ffmpeg_check(name, regex, checks, output):
    for check in checks:
        checking("if %s supports %s %s" % (ffmpeg[0], name, check))

        if re.search("\n %s %s " % (regex, check), output):
            stderr.write("yes\n")
        else:
            stderr.write("no\n")
            raise CheckError()

try:
    check("zopfli", var="GZIP")
except CheckError:
    check("gzip", ["-9"])

check("apngasm", run=False)
check("convert")
check("cwebp", ["-quiet", "-alpha_cleanup", "-m", "6"])
ffmpeg = check("ffmpeg", ["-v", "warning", "-y"], run=False)
ffmpeg_formats = run_ffmpeg("-formats")
ffmpeg_check("demuxing", "D.", ["matroska,webm", "ogg", "wav", "yuv4mpegpipe"], ffmpeg_formats)
ffmpeg_check("muxing", ".E", ["ipod", "mp4", "ogg", "wav", "webm", "yuv4mpegpipe"], ffmpeg_formats)
ffmpeg_check("decoding", ".{6}", ["mpeg4", "rawvideo", "pcm_s16le", "vorbis"], run_ffmpeg("-decoders"))
ffmpeg_check("encoding", ".{6}", ["libx264", "rawvideo", "libtheora", "libvpx", "libvpx-vp9", "libfdk_aac", "libopus", "pcm_s16le"], run_ffmpeg("-encoders"))
check("npm", ["--quiet"])
check("webpmux")
check("defluff", optional=True, run=False)
check("pngquant", optional=True)
check("zopflipng", optional=True)

stderr.write("creating Makefile.inc\n")

with open("Makefile.inc", "w") as f:
    f.write(''.join('%s := %s\n' % (k, subprocess.list2cmdline(cmds[k])) for k in cmds))
