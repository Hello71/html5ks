=======
HTML5KS
=======

.. image:: https://travis-ci.org/Hello71/html5ks.png?branch=master   :target: https://travis-ci.org/Hello71/html5ks

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
- GNU make
- ffmpeg with fdk-aac, libopus, libtheora, libvpx, libx264 (preferably git HEAD)
- cwebp and webpmux from libwebp
- convert from ImageMagick
- apngasm
- uglifyjs
- Node.js, npm, grunt

Recommended
'''''''''''
- jpegmini
- jpegtran
- jpegrescan
- pngquant
- DeflOpt
- defluff
- nginx
- zopfli
- inotify-tools (for ``make watch``)

Build steps
-----------

0. Get Katawa Shoujo.
1. Copy \*.rpyc from Katawa Shoujo/game into unrpyc/ directory.
2. Extract files from Katawa Shoujo/game/data.rpa with an rpa extractor, e.g. unrpa. Put files in www/dump.
3. Install prerequisites, download DeflOpt and defluff and place exes in this directory.
4. Run setup.sh. If you're on Windoze, sucks for you. Use a better OS. Patches may or may not be accepted.
5. Run nginx.sh to start nginx, then navigate to localhost:8080 in your browser.
   -- OR --
5. Open www/index.html in a browser.

Disabling unused conversions
----------------------------

To reduce programs and build time required, some conversions can be disabled. Defining MINIMAL as an environment variable will disable the safe ones.

Alternatively, specific conversions can be disabled by setting the appropriate program variable to ":". See the Makefile for more information.

Reducing disk usage
-------------------
Run ``make space``. Warning: This will remove source files from dump.

``make`` will continue to work (i.e. make new files as appropriate) but will not re-make converted files.

Contributing
------------

Check Bugzilla for things that need to be done. https://bugzilla.happinessforme.com/buglist.cgi?cmdtype=runnamed&namedcmd=Open+HTML5KS+bugs

See docs/ for the obvious.

Run ``make watch`` to automatically re-make when changes are made.

.. _`Katawa Shoujo`: http://www.katawa-shoujo.com/
