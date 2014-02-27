null :=
SPACE := $(null) $(null)

FFMPEG ?= ffmpeg
FFMPEG += -v warning -y
CWEBP ?= cwebp
CWEBP += -quiet -alpha_cleanup
WEBPMUX ?= webpmux
CONVERT ?= convert
APNGASM ?= apngasm
UGLIFYJS ?= uglifyjs
ifdef MINIMAL
ZOPFLIPNG ?= :
DEFLOPT ?= :
DEFLUFF ?= cat
PNGQUANT ?= :
else
ZOPFLIPNG ?= zopflipng
DEFLOPT ?= wine DeflOpt
DEFLUFF ?= defluff
PNGQUANT ?= pngquant
endif

DUMP ?= www/dump

all: video audio images js
# fails miserably, fix pls
#	cd unrpyc && $(MAKE) install

# === VIDEO ===

VIDEO := $(wildcard $(DUMP)/video/*.mkv)
Y4M := $(patsubst %.mkv,%.y4m,$(VIDEO))
MP4 := $(patsubst %.mkv,%.mp4,$(VIDEO))
WEBM := $(patsubst %.mkv,%.webm,$(VIDEO))
VP9 := $(patsubst %.mkv,%.vp9.webm,$(VIDEO))
OGV := $(patsubst %.mkv,%.ogv,$(VIDEO))
CVIDEO := $(MP4) $(WEBM) $(VP9) $(OGV)

video: $(CVIDEO)

%.y4m: %.mkv
	$(FFMPEG) -i "$<" -c:a copy "$@"

ifdef NOTEMP
%.mp4: %.mkv
else
%.mp4: %.y4m
endif
	$(FFMPEG) -i "$<" -c:v libx264 -preset slower -tune animation -movflags empty_moov -profile:v baseline -c:a libfdk_aac -b:a 60k "$@"

ifdef NOTEMP
%.webm: %.mkv
else
%.webm: %.y4m
endif
	$(FFMPEG) -i "$<" -crf 10 -b:v 1M -c:a copy "$@"

ifdef NOTEMP
%.vp9.webm: %.mkv
else
%.vp9.webm: %.y4m
endif
	$(FFMPEG) -i "$<" -strict -2 -c:v libvpx-vp9 -crf 8 -b:v 1M -c:a libopus -vbr 1 -b:a 64k "$@"

ifdef NOTEMP
%.ogv: %.mkv
else
%.ogv: %.y4m
endif
	$(FFMPEG) -i "$<" -c:v libtheora -qscale:v 10 -c:a copy "$@"

# === AUDIO ===

AUDIO := $(wildcard $(DUMP)/bgm/*.ogg) $(wildcard $(DUMP)/sfx/*.ogg)
OPUS := $(patsubst %.ogg,%.opus,$(AUDIO))
M4A := $(patsubst %.ogg,%.m4a,$(AUDIO))
WAV := $(patsubst %.ogg,%.wav,$(AUDIO))
CAUDIO := $(OPUS) $(M4A)

audio: $(CAUDIO)

%.wav: %.ogg
	$(FFMPEG) -i "$<" -c:a pcm_s16le "$@"

%.opus: %.wav
	$(FFMPEG) -i "$<" -c:a libopus -vbr 1 -b:a 64k "$@"

%.m4a: %.wav
	$(FFMPEG) -i "$<" -b:a 60k "$@"

# === IMAGES ===

PNG := $(shell find $(DUMP) -name '*.png' ! -name 'ctc_strip.png')
JPG := $(shell find $(DUMP) -name '*.jpg')
WEBP := $(patsubst %.png,%.webp,$(PNG)) \
        $(patsubst %.jpg,%.webp,$(JPG))
CTC_ANIM_SRC := $(DUMP)/ui/ctc_strip.png
CTC_ANIM_TMP := $(DUMP)/ui/ctc_strip-0.png $(DUMP)/ui/ctc_strip-1.png $(DUMP)/ui/ctc_strip-2.png $(DUMP)/ui/ctc_strip-3.png $(DUMP)/ui/ctc_strip-4.png $(DUMP)/ui/ctc_strip-5.png $(DUMP)/ui/ctc_strip-6.png $(DUMP)/ui/ctc_strip-7.png $(DUMP)/ui/ctc_strip-8.png $(DUMP)/ui/ctc_strip-9.png $(DUMP)/ui/ctc_strip-10.png $(DUMP)/ui/ctc_strip-11.png $(DUMP)/ui/ctc_strip-12.png $(DUMP)/ui/ctc_strip-13.png $(DUMP)/ui/ctc_strip-14.png $(DUMP)/ui/ctc_strip-15.png $(DUMP)/ui/ctc_strip-16.png $(DUMP)/ui/ctc_strip-17.png $(DUMP)/ui/ctc_strip-18.png $(DUMP)/ui/ctc_strip-19.png $(DUMP)/ui/ctc_strip-20.png $(DUMP)/ui/ctc_strip-21.png $(DUMP)/ui/ctc_strip-22.png $(DUMP)/ui/ctc_strip-23.png $(DUMP)/ui/ctc_strip-24.png $(DUMP)/ui/ctc_strip-25.png $(DUMP)/ui/ctc_strip-26.png $(DUMP)/ui/ctc_strip-27.png $(DUMP)/ui/ctc_strip-28.png $(DUMP)/ui/ctc_strip-29.png $(DUMP)/ui/ctc_strip-30.png $(DUMP)/ui/ctc_strip-31.png $(DUMP)/ui/ctc_strip-32.png $(DUMP)/ui/ctc_strip-33.png $(DUMP)/ui/ctc_strip-34.png $(DUMP)/ui/ctc_strip-35.png $(DUMP)/ui/ctc_strip-36.png $(DUMP)/ui/ctc_strip-37.png $(DUMP)/ui/ctc_strip-38.png $(DUMP)/ui/ctc_strip-39.png $(DUMP)/ui/ctc_strip-40.png $(DUMP)/ui/ctc_strip-41.png $(DUMP)/ui/ctc_strip-42.png $(DUMP)/ui/ctc_strip-43.png $(DUMP)/ui/ctc_strip-44.png $(DUMP)/ui/ctc_strip-45.png $(DUMP)/ui/ctc_strip-46.png $(DUMP)/ui/ctc_strip-47.png $(DUMP)/ui/ctc_strip-48.png $(DUMP)/ui/ctc_strip-49.png $(DUMP)/ui/ctc_strip-50.png $(DUMP)/ui/ctc_strip-51.png $(DUMP)/ui/ctc_strip-52.png $(DUMP)/ui/ctc_strip-53.png $(DUMP)/ui/ctc_strip-54.png $(DUMP)/ui/ctc_strip-55.png $(DUMP)/ui/ctc_strip-56.png $(DUMP)/ui/ctc_strip-57.png $(DUMP)/ui/ctc_strip-58.png $(DUMP)/ui/ctc_strip-59.png $(DUMP)/ui/ctc_strip-60.png $(DUMP)/ui/ctc_strip-61.png $(DUMP)/ui/ctc_strip-62.png $(DUMP)/ui/ctc_strip-63.png
CTC_ANIM_TMP_WEBP := $(patsubst %.png,%.webp,$(CTC_ANIM_TMP))
CTC_ANIM := $(DUMP)/ui/ctc_anim.png $(DUMP)/ui/ctc_anim.webp

CIMAGE := $(WEBP) $(CTC_ANIM) www/favicon.ico

images: $(CIMAGE)

$(DUMP)/ui/ctc_strip.webp: $(DUMP)/ui/ctc_strip.png

%.webp: %.png
	$(CWEBP) -q 99 -m 6 "$<" -o "$@"
	$(PNGQUANT) --force --speed 1 --ext .png "$<"
	$(ZOPFLIPNG) -m -y "$<" "$<"
	$(DEFLOPT) "$<"
	$(DEFLUFF) < "$<" > "$<".tmp
	mv -f "$<".tmp "$<"

%.webp: %.jpg
	$(CWEBP) -q 90 -m 6 "$<" -o "$@"

www/favicon.ico: $(DUMP)/ui/icon.png
	$(CONVERT) "$<" -resize 256x256 -transparent white "$@"

$(DUMP)/ui/bt-cf-unchecked.webp $(DUMP)/ui/bt-cf-checked.webp: %.webp: %.png
	$(CONVERT) -trim "$<" "$<"
	$(CWEBP) -q 99 -m 6 "$<" -o "$@"
	$(PNGQUANT) --force --speed 1 --ext .png "$<"
	$(ZOPFLIPNG) -m -y "$<" "$<"
	$(DEFLOPT) "$<"
	$(DEFLUFF) < "$<" > "$<".tmp
	mv -f "$<".tmp "$<"

$(DUMP)/ui/ctc_strip-0.png: $(CTC_ANIM_SRC)
	$(CONVERT) "$<" -crop 16x16 $(DUMP)/ui/ctc_strip-%d.png

$(DUMP)/ui/ctc_strip-%.png: $(CTC_ANIM_SRC) $(DUMP)/ui/ctc_strip-0.png
	@touch -r "$(DUMP)/ui/ctc_strip-0.png" "$@"

$(DUMP)/ui/ctc_anim.png: $(CTC_ANIM_TMP)
	$(APNGASM) "$@" $^ 3 100

$(DUMP)/ui/ctc_anim.webp: $(CTC_ANIM_TMP_WEBP)
	$(WEBPMUX) -frame $(subst $(SPACE), +30 -frame ,$^) +30 -loop 0 -o "$@"

# === JS ===

MYJS := www/js/html5ks.js www/js/menu.js www/js/api.js www/js/characters.js www/js/imachine.js www/js/i18n.js
JSLIBS := www/js/lib/when/when.js www/js/lib/fastclick/lib/fastclick.js \
          Modernizr/dist/modernizr-build.js www/js/lib/spin.js/spin.js
JSDATA := www/js/play.js www/js/images.js
JS := $(JSLIBS) $(MYJS) $(JSDATA)
JSOUT := www/js/all.min.js

Modernizr/dist/modernizr-build.js: config-all.json
	ln -fs ../../config-all.json Modernizr/lib/config-all.json
	cd Modernizr && npm update && node_modules/.bin/grunt build

js: $(JSOUT)

$(JSOUT): $(JS)
	$(UGLIFYJS) $(JS) -o "$@" --source-map "$@".map --source-map-url ./all.min.js.map -p 2 -m -c drop_debugger=false

# === MISC ===

clean:
	$(RM) $(CVIDEO) $(CAUDIO) $(CIMAGE)

jshint: $(MYJS)
	jshint $^

space:
	$(RM) -r $(DUMP)/font
	$(RM) $(WAV) $(VIDEO) $(CTC_ANIM_TMP) $(CTC_ANIM_TMP_WEBP) $(JSOUT) $(JSOUT).map

watch:
	$(MAKE)
	while inotifywait -r -e modify,delete,move --exclude="^\./\.git" --exclude="\.swp.?$$" .; do \
		$(MAKE); \
	done

# disable default rules, increases `make` speed by 3 seconds
MAKEFLAGS=-r

.INTERMEDIATE: $(Y4M) $(CTC_ANIM_TMP) $(CTC_ANIM_TMP_WEBP)
.PHONY: video audio images js jshint clean space watch
