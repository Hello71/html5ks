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
- GNU make 3.82 or greater
- ffmpeg with fdk-aac, libopus, libtheora, libvpx-vp9, libx264 (preferably git HEAD)
- cwebp and webpmux from libwebp
- convert from ImageMagick
- apngasm
- Node.js, npm

Recommended
'''''''''''
- DeflOpt
- defluff
- inotify-tools (for ``make watch``)
- jpegmini
- jpegrescan
- jpegtran
- nginx
- pngquant
- zopfli

Build steps
-----------

0. Get Katawa Shoujo, install prerequisites. For guidance on Ubuntu, see .travis.sh.
1. Copy \*.rpyc from Katawa Shoujo/game into unrpyc/ directory.
2. Extract files from Katawa Shoujo/game/data.rpa with an rpa extractor, e.g. unrpa. Put files in www/dump.
3. Install prerequisites, download DeflOpt and defluff and place exes in this directory.
4. Run ./configure.
5. Run make.
6. Run nginx.sh to start nginx, then navigate to localhost:8080 in your browser.
   -- OR --
6. Open www/index.html in a browser.

Disabling unused conversions
----------------------------

To reduce programs and build time required, some conversions can be disabled.
Defining MINIMAL as an environment variable will disable the safe ones.

Alternatively, specific conversions can be disabled by passing ``PROGRAM=`` on the command line, i.e. leaving it undefined.
See the Makefile for more information.

Reducing disk usage
-------------------
Run ``make space``. Warning: This will remove source files from dump.

``make`` will continue to work (i.e. make new files as appropriate) but will not re-make converted files.

Contributing
------------

Check Bugzilla for things that need to be done. https://bugzilla.happinessforme.com/buglist.cgi?cmdtype=runnamed&namedcmd=Open+HTML5KS+bugs

See docs/ for the obvious.

Run ``make dev`` to automatically start nginx and re-make when changes are made.

.. _`Katawa Shoujo`: http://www.katawa-shoujo.com/
