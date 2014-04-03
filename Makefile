null :=
SPACE := $(null) $(null)

all: js json video audio images

Makefile: Makefile.inc

Makefile.inc: configure
	./configure $@

include Makefile.inc

UGLIFYJS := node_modules/.bin/uglifyjs $(UGLIFYJSFLAGS)

# === JS ===

MYJS := www/js/html5ks.js www/js/menu.js www/js/api.js \
        www/js/characters.js www/js/imachine.js www/js/i18n.js
JSLIBS := www/js/lib/fastclick.js www/js/lib/modernizr-build.js \
          www/js/lib/when.js www/js/lib/spin.js
JSDATA := www/js/play.js www/js/images.js
JS := $(JSLIBS) $(MYJS) $(JSDATA)
JSOUT := www/js/all.min.js

js: $(JSOUT)

$(JSOUT): $(UGLIFYJS) $(JS)
	$^ -o "$@" --source-map "$@".map --source-map-url ./all.min.js.map --screw-ie8 -p 2 -m -c unsafe=true,drop_debugger=false

$(UGLIFYJS): package.json
	$(NPM) update
	touch "$@"

www/js/lib/modernizr-build.js: Modernizr config-all.json
	ln -fs ../../config-all.json "$<"/lib/config-all.json
	cd "$<" && $(NPM) update && node_modules/.bin/grunt build

www/js/lib/when.js: when
	export PYTHON=python2; cd when && $(NPM) update && $(NPM) run browserify-debug

# === JSON ===
IRPYC := ast2json/imachine.rpyc ast2json/imachine_replay.rpyc
IJSON := $(IRPYC:ast2json/%.rpyc=www/json/%.json)

URPYC := ast2json/ui-strings.rpyc ast2json/ui-strings_FR.rpyc
UJSON := $(URPYC:ast2json/%.rpyc=www/json/%.json)

SRPYC := $(wildcard ast2json/script-a*.rpyc)
JSONI := $(SRPYC:%.rpyc=%.json.i)
SJSON := $(SRPYC:ast2json/%.rpyc=www/json/%.json)

JSON := $(IJSON) $(UJSON) $(SJSON)
JSONGZ := $(JSON:=.gz)
AJSON := $(JSON) $(JSONGZ)

json: $(AJSON)

%.json.i: ast2json/rpyc2json.py %.rpyc
	$^ $@

$(SJSON): www/json/%.json: ast2json/script2json.py ast2json/%.json.i
	$^ $@

$(UJSON): www/json/%.json: ast2json/strings2json.py ast2json/%.json.i
	$^ $@

$(IJSON): www/json/%.json: ast2json/imachine2json.py ast2json/%.json.i
	$^ $@

%.json.gz: %.json
ifdef GZIP
ifdef DEFLUFF
	$(GZIP) -c $< | $(DEFLUFF) > $@
else
	$(GZIP) -c $< > $@
endif
	touch $< $@
endif

# === VIDEO ===

VIDEO := $(wildcard www/dump/video/*.mkv)
Y4M := $(VIDEO:.mkv=.y4m)
MP4 := $(VIDEO:.mkv=.mp4)
WEBM := $(VIDEO:.mkv=.webm)
VP9 := $(VIDEO:.mkv=.vp9.webm)
OGV := $(VIDEO:.mkv=.ogv)
CVIDEO := $(MP4) $(WEBM) $(VP9) $(OGV)

video: $(CVIDEO)

%.y4m: %.mkv
	$(FFMPEG) -i "$<" -c:a copy "$@"

$(if $(NOTEMP),%.mp4: %.mkv,%.mp4: %.y4m)
	$(FFMPEG) -i "$<" -c:v libx264 -preset slower -tune animation -movflags empty_moov -profile:v baseline -c:a libfdk_aac -b:a 60k "$@"

$(if $(NOTEMP),%.webm: %.mkv,%.webm: %.y4m)
	$(FFMPEG) -i "$<" -crf 10 -b:v 1M -c:a copy "$@"

$(if $(NOTEMP),%.vp9.webm: %.mkv,%.vp9.webm: %.y4m)
	$(FFMPEG) -i "$<" -strict -2 -c:v libvpx-vp9 -crf 8 -b:v 1M -c:a libopus -vbr on -b:a 64k "$@"

$(if $(NOTEMP),%.ogv: %.mkv,%.ogv: %.y4m)
	$(FFMPEG) -i "$<" -c:v libtheora -qscale:v 10 -c:a copy "$@"

# === AUDIO ===

AUDIO := $(wildcard www/dump/bgm/*.ogg) $(wildcard www/dump/sfx/*.ogg)
OPUS := $(AUDIO:.ogg=.opus)
M4A := $(AUDIO:.ogg=.m4a)
WAV := $(AUDIO:.ogg=.wav)
CAUDIO := $(OPUS) $(M4A)

audio: $(CAUDIO)

%.wav: %.ogg
	$(FFMPEG) -i "$<" -c:a pcm_s16le "$@"

%.opus: %.wav
	$(FFMPEG) -i "$<" -c:a libopus -vbr on -b:a 64k "$@"

%.m4a: %.wav
	$(FFMPEG) -i "$<" -b:a 60k "$@"

# === IMAGES ===

PNG := $(shell find www/dump -name '*.png' ! -name 'ctc_strip.png')
JPG := $(shell find www/dump -name '*.jpg')
WEBP := $(PNG:.png=.webp) $(JPG:.jpg=.webp)
CTC_ANIM_SRC := www/dump/ui/ctc_strip.png
CTC_ANIM_MORE_TMP := $(foreach n, 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 \
																	18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 \
																	33 34 35 36 37 38 39 40 41 42 43 44 45 46	47 \
																	48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 \
																	63, www/dump/ui/ctc_strip-$(n).png)
CTC_ANIM_TMP := www/dump/ui/ctc_strip-0.png $(CTC_ANIM_MORE_TMP)
CTC_ANIM_TMP_WEBP := $(CTC_ANIM_TMP:%.png=%.webp)
CTC_ANIM_TMP_ALL := $(CTC_ANIM_TMP) $(CTC_ANIM_TMP_WEBP)
CTC_ANIM := www/dump/ui/ctc_anim.png www/dump/ui/ctc_anim.webp

CIMAGE := $(WEBP) $(CTC_ANIM) www/favicon.ico

images: $(CIMAGE)

define png2webp =
	$(CWEBP) -q 99 "$<" -o "$@"
	$(if $(PNGQUANT), $(PNGQUANT) --force --speed 1 --ext .png "$<")
	$(if $(ZOPFLIPNG), $(ZOPFLIPNG) -m -y "$<" "$<")
	$(if $(DEFLOPT), $(DEFLOPT) "$<")
	$(if $(DEFLUFF), $(DEFLUFF) < "$<" > "$<".tmp
	mv -f "$<".tmp "$<")
endef

%.webp: %.png
	$(png2webp)

%.webp: %.jpg
	$(CWEBP) -q 90 "$<" -o "$@"

www/dump/ui/ctc_strip.webp: www/dump/ui/ctc_strip.png

www/favicon.ico: www/dump/ui/icon.png
	$(CONVERT) "$<" -resize 256x256 -transparent white "$@"

www/dump/ui/bt-cf-unchecked.webp www/dump/ui/bt-cf-checked.webp: %.webp: %.png
	$(CONVERT) -trim "$<" "$<"
	$(png2webp)

www/dump/ui/ctc_strip-0.png: $(CTC_ANIM_SRC)
	$(CONVERT) "$<" -crop 16x16 www/dump/ui/ctc_strip-%d.png

$(CTC_ANIM_MORE_TMP): $(CTC_ANIM_SRC) www/dump/ui/ctc_strip-0.png

# depend on webp to wait for recompression
www/dump/ui/ctc_anim.png: $(CTC_ANIM_TMP_WEBP)
	$(APNGASM) "$@" $(CTC_ANIM_TMP) 3 100

www/dump/ui/ctc_anim.webp: $(CTC_ANIM_TMP_WEBP)
	$(WEBPMUX) -frame $(subst $(SPACE), +30 -frame ,$^) +30 -loop 0 -o "$@"

# === MISC ===

test: $(MYJS)
	jshint --show-non-errors $^

space:
	$(RM) -r www/dump/font
	$(RM) $(WAV) $(VIDEO) $(CTC_ANIM_TMP) $(CTC_ANIM_TMP_WEBP) $(JSOUT) $(JSOUT).map

dev:
	$(MAKE)
	./nginx.sh
	while inotifywait -r -e modify,delete,move --exclude="^\./\.git" --exclude="\.swp.?$$" .; do \
		$(MAKE); \
	done

# disable implicit rules, increases `make` speed by 3 seconds
# also check symlink targets (for js)
MAKEFLAGS=-LRr
.SUFFIXES:

.PRECIOUS: $(WAV)
.INTERMEDIATE: $(WAV) $(JSONO) $(Y4M) $(CTC_ANIM_TMP_ALL) $(CTC_ANIM_TMP_WEBP)
.PHONY: video audio images js jshint space watch
