=======
HTML5KS
=======

.. image:: https://travis-ci.org/Hello71/html5ks.png
   :target: https://travis-ci.org/Hello71/html5ks

This is a WIP HTML5 implementation of the game `Katawa Shoujo`_.

How to use
==========
1. Navigate to http://html5ks.happinessforme.com/

How to build
============

Requirements
------------
- Katawa Shoujo (obviously)
- Firefox/Chrome/a sensible browser (i.e. not IE)
- a shell (Bash, dash, zsh, etc)
- GNU make 3.82 or greater (see `Makefile`_ section)
- ffmpeg (preferably git HEAD) with fdk-aac, libopus, libtheora, libvpx-vp9, libx264 - for full list, see ``configure`` or ``.travis.sh``
- cwebp and webpmux from libwebp
- convert from ImageMagick
- apngasm
- Node.js, npm for uglifyjs
- Python 3

Recommended
'''''''''''
- DeflOpt
- defluff
- inotify-tools (for ``make dev``)
- jpegmini
- jpegrescan
- jpegtran
- nginx
- pngquant
- zopfli and zopflipng

Build steps
-----------

0. Get Katawa Shoujo, install prerequisites. For guidance on Ubuntu, see .travis.sh.
1. Copy \*.rpyc from Katawa Shoujo/game into ast2json/ directory.
2. Extract files from Katawa Shoujo/game/data.rpa to www/dump/ with an rpa extractor, like rpatool or unrpa.
3. Install prerequisites.
4. Run ./configure.
5. Run make.
6. Run nginx.sh to start nginx, then navigate to localhost:8080 in your browser.
   -- OR --
6. Open www/index.html in a browser.

Disabling unused conversions
----------------------------

To reduce programs and build time required, some conversions can be disabled.
Passing --minimal to configure will disable the safe ones.

Alternatively, specific conversions can be disabled by passing --disable-conversion on the command line.
See ``./configure --help`` for more information.

Reducing disk usage
===================
Run ``make space``. Warning: This will remove source files from dump.

``make`` will continue to work (i.e. make new files as appropriate) but will not re-make converted files.

Contributing
============

See ``CONTRIBUTING.rst``.

Makefile
========

Run ``make dev`` to automatically start nginx and re-make when changes are made.

GNU make is required since I do not really want to write a script to output a Makefile.
I refuse to use autoconf; moreover, it isn't even relevant to this program, being designed for use with C/C++ projects.

Make 3.82 is required since this version sorts rules differently; versions of make prior to this one will not properly build www/dump/ctc_strip-0.png, resulting in errors building ctc_anim.png and ctc_anim-*.webp.
If you must use a version before that one (e.g. you are stuck on Ubuntu 12.04), manually building that file according to the Makefile should resolve the error.
Patches to fix this are welcome.

.. _`Katawa Shoujo`: http://www.katawa-shoujo.com/
