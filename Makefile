null :=
SPACE := $(null) $(null)

FFMPEG ?= ffmpeg
FFMPEG := $(FFMPEG) -v warning -y $(FFMPEGFLAGS)
CWEBP ?= cwebp
CWEBP := $(CWEBP) -quiet -alpha_cleanup -m 6 $(CWEBPFLAGS)
WEBPMUX ?= webpmux
WEBPMUX := $(WEBPMUX) $(WEBPMUXFLAGS)
CONVERT ?= convert
CONVERT := $(CONVERT) $(CONVERTFLAGS)
APNGASM ?= apngasm
APNGASM := $(APNGASM) $(APNGASMFLAGS)
NPM ?= npm
NPM := $(NPM) --quiet $(NPMFLAGS)
JS_COMPRESSOR ?= uglifyjs
LOCAL_UGLIFYJS := node_modules/.bin/uglifyjs
UGLIFYJS ?= $(LOCAL_UGLIFYJS)
UGLIFYJS := $(UGLIFYJS) $(UGLIFYJSFLAGS)
PACKR ?= packr
CLOSURE_COMPILER ?= java -jar compiler.jar
ifndef MINIMAL
ZOPFLIPNG ?= zopflipng
ZOPFLIPNG := $(ZOPFLIPNG) $(ZOPFLIPNGFLAGS)
#DEFLOPT ?= wine DeflOpt
#DEFLOPT := $(DEFLOPT) $(DEFLOPTFLAGS)
DEFLUFF ?= defluff
DEFLUFF := $(DEFLUFF) $(DEFLUFFFLAGS)
PNGQUANT ?= pngquant
PNGQUANT := $(PNGQUANT) $(PNGQUANTFLAGS)
endif
GZIP := $(shell unrpyc/find-gzip.sh)

all: js json video audio images

# === JS ===

MYJS := www/js/html5ks.js www/js/menu.js www/js/api.js \
        www/js/characters.js www/js/imachine.js www/js/i18n.js
JSLIBS := www/js/lib/fastclick.js www/js/lib/modernizr-build.js \
          www/js/lib/when.js www/js/lib/spin.js
JSDATA := www/js/play.js www/js/images.js
JS := $(JSLIBS) $(MYJS) $(JSDATA)
JSOUT := www/js/all.min.js

js: $(JSOUT)

ifeq ($(JS_COMPRESSOR), uglifyjs)
$(JSOUT): $(JS) $(UGLIFYJS)
	$(UGLIFYJS) $(JS) -o "$@" --source-map "$@".map --source-map-url ./all.min.js.map --screw-ie8 -p 2 -m -c unsafe=true,drop_debugger=false
else
$(JSOUT): $(JS)
# note that packr doesn't actually work
ifeq ($(JS_COMPRESSOR), packr)
	$(PACKR) $(JS) -o "$@"
else
ifeq ($(JS_COMPRESSOR), closure_compiler)
	$(CLOSURE_COMPILER) --compilation_level SIMPLE_OPTIMIZATIONS --create_source_map "$@".map --js $(subst $(SPACE), --js ,$(JS)) --js_output_file "$@"
endif # ($(JS_COMPRESSOR), closure_compiler)
endif # ($(JS_COMPRESSOR), packr)
endif # ($(JS_COMPRESSOR), uglifyjs)

$(LOCAL_UGLIFYJS): package.json
	$(NPM) update
	touch "$@"

www/js/lib/modernizr-build.js: Modernizr config-all.json
	ln -fs ../../config-all.json "$<"/lib/config-all.json
	cd "$<" && $(NPM) update && node_modules/.bin/grunt build

www/js/lib/when.js: when
	export PYTHON=python2; cd when && $(NPM) update && $(NPM) run browserify-debug

# === JSON ===
JSON := www/json/script.json www/json/script.json.gz www/json/imachine.json \
				www/json/imachine.json.gz www/json/ui-strings.json \
				www/json/ui-strings.json.gz www/json/ui-strings_FR.json \
				www/json/ui-strings_FR.json.gz

RPYC := unrpyc/script-a1-friday_FR.rpyc unrpyc/script-a1-friday.rpyc \
        unrpyc/script-a1-monday_FR.rpyc unrpyc/script-a1-monday.rpyc \
        unrpyc/script-a1-saturday_FR.rpyc unrpyc/script-a1-saturday.rpyc \
        unrpyc/script-a1-sunday_FR.rpyc unrpyc/script-a1-sunday.rpyc \
        unrpyc/script-a1-thursday_FR.rpyc unrpyc/script-a1-thursday.rpyc \
        unrpyc/script-a1-tuesday_FR.rpyc unrpyc/script-a1-tuesday.rpyc \
        unrpyc/script-a1-wednesday_FR.rpyc unrpyc/script-a1-wednesday.rpyc \
        unrpyc/script-a2-emi_FR.rpyc unrpyc/script-a2-emi.rpyc \
        unrpyc/script-a2-hanako_FR.rpyc unrpyc/script-a2-hanako.rpyc \
        unrpyc/script-a2-lilly_FR.rpyc unrpyc/script-a2-lilly.rpyc \
        unrpyc/script-a2-rin_FR.rpyc unrpyc/script-a2-rin.rpyc \
        unrpyc/script-a2-shizune_FR.rpyc unrpyc/script-a2-shizune.rpyc \
        unrpyc/script-a3-emi_FR.rpyc unrpyc/script-a3-emi.rpyc \
        unrpyc/script-a3-hanako_FR.rpyc unrpyc/script-a3-hanako.rpyc \
        unrpyc/script-a3-lilly_FR.rpyc unrpyc/script-a3-lilly.rpyc \
        unrpyc/script-a3-rin_FR.rpyc unrpyc/script-a3-rin.rpyc \
        unrpyc/script-a3-shizune_FR.rpyc unrpyc/script-a3-shizune.rpyc \
        unrpyc/script-a4-emi_FR.rpyc unrpyc/script-a4-emi.rpyc \
        unrpyc/script-a4-hanako_FR.rpyc unrpyc/script-a4-hanako.rpyc \
        unrpyc/script-a4-lilly_FR.rpyc unrpyc/script-a4-lilly.rpyc \
        unrpyc/script-a4-rin_FR.rpyc unrpyc/script-a4-rin.rpyc \
        unrpyc/script-a4-shizune_FR.rpyc unrpyc/script-a4-shizune.rpyc
SJSON := $(patsubst unrpyc/%.rpyc,www/json/%.json,$(RPYC))
JSONO := $(patsubst unrpyc/%.rpyc,unrpyc/%.json.o,%(RPYC))

# FIXME
# json: $(JSON)
json:

%.json.gz: %.json
	$(GZIP) -c $< > $@
	touch $< $@

www/json/script.json: $(SJSON)
	cat $^ > "$@"
	sed -i -e 's/^/{/;s/,$$/}/' "$@"

www/json/%.json: unrpyc/%.json.o
	uglifyjs "$<" --expr > "$@"

define unrpyc =
	python3 unrpyc/unrpyc.py --clobber "$<" "$@"
endef

unrpyc/ui-strings.json.o unrpyc/ui-strings_FR.json.o: unrpyc/ui-strings%.json.o: unrpyc/ui-strings%.rpyc unrpyc/*.py
	$(unrpyc)
	sed -i -e 's/    \["init_language", "[a-z]*", \],//;s/^\]}$$/}/' "$@"

unrpyc/ui_settings.json.o: ui_settings.rpyc *.py
	python3 unrpyc.py --clobber "$<" --ignore-python "$@"
	sed -i -e 's/,,/,/g;/: *,$$/d' "$@"

unrpyc/%.json.o: unrpyc/%.rpyc unrpyc/*.py
	$(unrpyc)

www/json/script-%.json: unrpyc/script-%.json.o
	uglifyjs "$<" --expr > "$@"
	sed -i -e 's/^{//;s/}$$/,/' "$@"

# === VIDEO ===

VIDEO := $(wildcard www/dump/video/*.mkv)
Y4M := $(patsubst %.mkv,%.y4m,$(VIDEO))
MP4 := $(patsubst %.mkv,%.mp4,$(VIDEO))
WEBM := $(patsubst %.mkv,%.webm,$(VIDEO))
VP9 := $(patsubst %.mkv,%.vp9.webm,$(VIDEO))
OGV := $(patsubst %.mkv,%.ogv,$(VIDEO))
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
OPUS := $(patsubst %.ogg,%.opus,$(AUDIO))
M4A := $(patsubst %.ogg,%.m4a,$(AUDIO))
WAV := $(patsubst %.ogg,%.wav,$(AUDIO))
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
WEBP := $(patsubst %.png,%.webp,$(PNG)) \
        $(patsubst %.jpg,%.webp,$(JPG))
CTC_ANIM_SRC := www/dump/ui/ctc_strip.png
CTC_ANIM_MORE_TMP := www/dump/ui/ctc_strip-1.png \
                     www/dump/ui/ctc_strip-2.png www/dump/ui/ctc_strip-3.png \
                     www/dump/ui/ctc_strip-4.png www/dump/ui/ctc_strip-5.png \
                     www/dump/ui/ctc_strip-6.png www/dump/ui/ctc_strip-7.png \
                     www/dump/ui/ctc_strip-8.png www/dump/ui/ctc_strip-9.png \
                     www/dump/ui/ctc_strip-10.png www/dump/ui/ctc_strip-11.png \
                     www/dump/ui/ctc_strip-12.png www/dump/ui/ctc_strip-13.png \
                     www/dump/ui/ctc_strip-14.png www/dump/ui/ctc_strip-15.png \
                     www/dump/ui/ctc_strip-16.png www/dump/ui/ctc_strip-17.png \
                     www/dump/ui/ctc_strip-18.png www/dump/ui/ctc_strip-19.png \
                     www/dump/ui/ctc_strip-20.png www/dump/ui/ctc_strip-21.png \
                     www/dump/ui/ctc_strip-22.png www/dump/ui/ctc_strip-23.png \
                     www/dump/ui/ctc_strip-24.png www/dump/ui/ctc_strip-25.png \
                     www/dump/ui/ctc_strip-26.png www/dump/ui/ctc_strip-27.png \
                     www/dump/ui/ctc_strip-28.png www/dump/ui/ctc_strip-29.png \
                     www/dump/ui/ctc_strip-30.png www/dump/ui/ctc_strip-31.png \
                     www/dump/ui/ctc_strip-32.png www/dump/ui/ctc_strip-33.png \
                     www/dump/ui/ctc_strip-34.png www/dump/ui/ctc_strip-35.png \
                     www/dump/ui/ctc_strip-36.png www/dump/ui/ctc_strip-37.png \
                     www/dump/ui/ctc_strip-38.png www/dump/ui/ctc_strip-39.png \
                     www/dump/ui/ctc_strip-40.png www/dump/ui/ctc_strip-41.png \
                     www/dump/ui/ctc_strip-42.png www/dump/ui/ctc_strip-43.png \
                     www/dump/ui/ctc_strip-44.png www/dump/ui/ctc_strip-45.png \
                     www/dump/ui/ctc_strip-46.png www/dump/ui/ctc_strip-47.png \
                     www/dump/ui/ctc_strip-48.png www/dump/ui/ctc_strip-49.png \
                     www/dump/ui/ctc_strip-50.png www/dump/ui/ctc_strip-51.png \
                     www/dump/ui/ctc_strip-52.png www/dump/ui/ctc_strip-53.png \
                     www/dump/ui/ctc_strip-54.png www/dump/ui/ctc_strip-55.png \
                     www/dump/ui/ctc_strip-56.png www/dump/ui/ctc_strip-57.png \
                     www/dump/ui/ctc_strip-58.png www/dump/ui/ctc_strip-59.png \
                     www/dump/ui/ctc_strip-60.png www/dump/ui/ctc_strip-61.png \
                     www/dump/ui/ctc_strip-62.png www/dump/ui/ctc_strip-63.png
CTC_ANIM_TMP := www/dump/ui/ctc_strip-0.png $(CTC_ANIM_MORE_TMP)
CTC_ANIM_TMP_WEBP := $(patsubst %.png,%.webp,$(CTC_ANIM_TMP))
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
	@

www/favicon.ico: www/dump/ui/icon.png
	$(CONVERT) "$<" -resize 256x256 -transparent white "$@"

www/dump/ui/bt-cf-unchecked.webp www/dump/ui/bt-cf-checked.webp: %.webp: %.png
	$(CONVERT) -trim "$<" "$<"
	$(png2webp)

www/dump/ui/ctc_strip-0.png: $(CTC_ANIM_SRC)
	$(CONVERT) "$<" -crop 16x16 www/dump/ui/ctc_strip-%d.png

$(CTC_ANIM_MORE_TMP): $(CTC_ANIM_SRC) www/dump/ui/ctc_strip-0.png
	@

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
.PHONY: video audio images js jshint clean space watch
