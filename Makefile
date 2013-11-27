FFMPEG ?= ffmpeg
FFMPEG += -v warning $(FFMPEGFLAGS)
OPUSENC ?= opusenc
ZOPFLIPNG ?= zopflipng
JPEGOPTIM ?= jpegoptim
CWEBP ?= cwebp
CONVERT ?= convert

DUMP ?= www/dump

all: video audio images

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

images: $(WEBP) favicon.ico

%.webp: %.png
	$(ZOPFLIPNG) -m -y $< $<
	$(CWEBP) -q 99 -m 6 $< -o $@

%.webp: %.jpg
	$(JPEGOPTIM) --strip-all $<
	$(CWEBP) -q 90 -m 6 $< -o $@

www/favicon.ico: www/dump/ui/icon.png
	$(CONVERT) $< -resize 256x256 -transparent white $@

clean:
	$(RM) $(CVIDEO) $(CAUDIO) $(WEBP)

.PHONY: video audio images clean
