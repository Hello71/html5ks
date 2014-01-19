null      :=
SPACE     := $(null) $(null)

FFMPEG ?= ffmpeg
FFMPEG += -v warning $(FFMPEGFLAGS)
OPUSENC ?= opusenc
ZOPFLIPNG ?= zopflipng
OPTIPNG ?= optipng
JPEGOPTIM ?= jpegoptim
CWEBP ?= cwebp
CWEBP += -short -alpha_cleanup
WEBPMUX ?= webpmux
CONVERT ?= convert
APNGASM ?= apngasm
UGLIFYJS ?= uglifyjs

DUMP ?= www/dump

all: video audio images js

# === VIDEO ===

VIDEO := $(wildcard $(DUMP)/video/*.mkv)
MP4 := $(patsubst %.mkv,%.mp4,$(VIDEO))
WEBM := $(patsubst %.mkv,%.webm,$(VIDEO))
OGV := $(patsubst %.mkv,%.ogv,$(VIDEO))
CVIDEO := $(MP4) $(WEBM) $(OGV)

video: $(CVIDEO)

%.mp4: %.mkv
	$(FFMPEG) -i $< -c:v libx264 -preset slower -tune animation -c:a libfdk_aac $@

%.webm: %.mkv
	$(FFMPEG) -i $< -c:v libvpx -crf 15 -b:v 1M -c:a copy $@

%.ogv: %.mkv
	$(FFMPEG) -i $< -c:v libtheora -qscale:v 6 -c:a copy $@

# === AUDIO ===

AUDIO := $(shell find $(DUMP)/bgm $(DUMP)/sfx -name '*.ogg')
OPUS := $(patsubst %.ogg,%.opus,$(AUDIO))
M4A := $(patsubst %.ogg,%.m4a,$(AUDIO))
WAV := $(patsubst %.ogg,%.wav,$(AUDIO))
CAUDIO := $(OPUS) $(M4A)

audio: $(CAUDIO)

%.wav: %.ogg
	$(FFMPEG) -i $< -c:a pcm_s16le $@

%.opus: %.wav
	$(OPUSENC) --bitrate 64 $< $@

%.m4a: %.wav
	$(FFMPEG) -i $< -c:a libfdk_aac -vbr 2 $@

# === IMAGES ===

PNG := $(shell find $(DUMP) -name '*.png')
JPG := $(shell find $(DUMP) -name '*.jpg')
WEBP := $(patsubst %.png,%.webp,$(PNG)) \
        $(patsubst %.jpg,%.webp,$(JPG))
CTC_ANIM_SRC := $(DUMP)/ui/ctc_strip.png
CTC_ANIM_TMP := $(DUMP)/ui/ctc_strip-0.png $(DUMP)/ui/ctc_strip-1.png $(DUMP)/ui/ctc_strip-2.png $(DUMP)/ui/ctc_strip-3.png $(DUMP)/ui/ctc_strip-4.png $(DUMP)/ui/ctc_strip-5.png $(DUMP)/ui/ctc_strip-6.png $(DUMP)/ui/ctc_strip-7.png $(DUMP)/ui/ctc_strip-8.png $(DUMP)/ui/ctc_strip-9.png $(DUMP)/ui/ctc_strip-10.png $(DUMP)/ui/ctc_strip-11.png $(DUMP)/ui/ctc_strip-12.png $(DUMP)/ui/ctc_strip-13.png $(DUMP)/ui/ctc_strip-14.png $(DUMP)/ui/ctc_strip-15.png $(DUMP)/ui/ctc_strip-16.png $(DUMP)/ui/ctc_strip-17.png $(DUMP)/ui/ctc_strip-18.png $(DUMP)/ui/ctc_strip-19.png $(DUMP)/ui/ctc_strip-20.png $(DUMP)/ui/ctc_strip-21.png $(DUMP)/ui/ctc_strip-22.png $(DUMP)/ui/ctc_strip-23.png $(DUMP)/ui/ctc_strip-24.png $(DUMP)/ui/ctc_strip-25.png $(DUMP)/ui/ctc_strip-26.png $(DUMP)/ui/ctc_strip-27.png $(DUMP)/ui/ctc_strip-28.png $(DUMP)/ui/ctc_strip-29.png $(DUMP)/ui/ctc_strip-30.png $(DUMP)/ui/ctc_strip-31.png $(DUMP)/ui/ctc_strip-32.png $(DUMP)/ui/ctc_strip-33.png $(DUMP)/ui/ctc_strip-34.png $(DUMP)/ui/ctc_strip-35.png $(DUMP)/ui/ctc_strip-36.png $(DUMP)/ui/ctc_strip-37.png $(DUMP)/ui/ctc_strip-38.png $(DUMP)/ui/ctc_strip-39.png $(DUMP)/ui/ctc_strip-40.png $(DUMP)/ui/ctc_strip-41.png $(DUMP)/ui/ctc_strip-42.png $(DUMP)/ui/ctc_strip-43.png $(DUMP)/ui/ctc_strip-44.png $(DUMP)/ui/ctc_strip-45.png $(DUMP)/ui/ctc_strip-46.png $(DUMP)/ui/ctc_strip-47.png $(DUMP)/ui/ctc_strip-48.png $(DUMP)/ui/ctc_strip-49.png $(DUMP)/ui/ctc_strip-50.png $(DUMP)/ui/ctc_strip-51.png $(DUMP)/ui/ctc_strip-52.png $(DUMP)/ui/ctc_strip-53.png $(DUMP)/ui/ctc_strip-54.png $(DUMP)/ui/ctc_strip-55.png $(DUMP)/ui/ctc_strip-56.png $(DUMP)/ui/ctc_strip-57.png $(DUMP)/ui/ctc_strip-58.png $(DUMP)/ui/ctc_strip-59.png $(DUMP)/ui/ctc_strip-60.png $(DUMP)/ui/ctc_strip-61.png $(DUMP)/ui/ctc_strip-62.png $(DUMP)/ui/ctc_strip-63.png
CTC_ANIM_TMP_WEBP := $(patsubst %.png,%.webp,$(CTC_ANIM_TMP))
CTC_ANIM := $(DUMP)/ui/ctc_anim.png $(DUMP)/ui/ctc_anim.webp

images: $(WEBP) $(CTC_ANIM) www/favicon.ico

%.webp: %.png
	$(ZOPFLIPNG) -m -y $< $<
	$(CWEBP) -q 99 -m 6 $< -o $@

%.webp: %.jpg
	$(JPEGOPTIM) --strip-all $<
	$(CWEBP) -q 90 -m 6 $< -o $@

www/favicon.ico: $(DUMP)/ui/icon.png
	$(CONVERT) $< -resize 256x256 -transparent white $@

$(DUMP)/ui/bt-cf-unchecked.webp $(DUMP)/ui/bt-cf-checked.webp: %.webp: %.png
	$(CONVERT) -trim $< $<
	$(OPTIPNG) -o7 $<
	$(ZOPFLIPNG) -m -y $< $<
	$(CWEBP) -q 99 -m 6 $< -o $@

$(DUMP)/ui/ctc_strip-0.png: $(CTC_ANIM_SRC)
	$(CONVERT) $< -crop 16x16 $(patsubst %.png,%*.png,$<)

$(DUMP)/ui/ctc_strip-%.png: $(CTC_ANIM_SRC) $(DUMP)/ui/ctc_strip-0.png
	@touch $@

$(DUMP)/ui/ctc_anim.png: $(CTC_ANIM_TMP)
	$(APNGASM) $@ $^ 3 100

$(DUMP)/ui/ctc_anim.webp: $(CTC_ANIM_TMP_WEBP)
	$(WEBPMUX) -frame $(subst $(SPACE), +30 -frame ,$^) +30 -loop 0 -o $@

# === JS ===

JS := www/js/html5ks.js www/js/menu.js www/js/api.js www/js/play.js www/js/images.js www/js/characters.js www/js/imachine.js www/js/i18n.js

js: www/js/all.min.js

www/js/all.min.js: $(JS)
	$(UGLIFYJS) $^ -o $@ -p 2 -m -c drop_debugger=false

# === MISC ===

clean:
	$(RM) $(CVIDEO) $(CAUDIO) $(WEBP) www/favicon.ico

jshint: $(JS)
	jshint $^

space:
	find $(DUMP) \( -name '*.wav' -o -name '*.mkv' -o -path "$(DUMP)/font*" \) -delete

watch:
	while inotifywait -r -e modify,delete,move --exclude="^\./\.git" --exclude="\.swp$$" .; do \
		${MAKE}; \
	done

.PHONY: video audio images js jshint clean space watch
.SUFFIXES:
