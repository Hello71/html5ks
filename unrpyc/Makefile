gzip := $(shell ./find-gzip.sh)

all: script.json script.json.gz imachine.json imachine.json.gz imachine_replay.json imachine_replay.json.gz ui-strings.json ui-strings.json.gz

%.json.gz: %.json
	$(gzip) -c $< > $@
	touch $< $@

script.json: $(patsubst %.rpyc,%.json,$(wildcard script-*.rpyc))
	cat script-*.json > script.json
	sed -i -e 's/^/{/;s/,$$/}/' script.json

%.json: %.json.o
	node fix.js $< $@

%.json.o: %.rpyc *.py
	python unrpyc.py --clobber $< $@

script-%.json: script-%.json.o
	node fix.js $< $@
	sed -i -e 's/^{//;s/}$$/,/' $@

clean:
	rm -f *.json.o *.json *.gz

test: all
	jshint --show-non-errors *.json

install: all
	install -t ../www/scripts script.json script.json.gz imachine.json imachine.json.gz imachine_replay.json imachine_replay.json.gz ui-strings.json ui-strings.json.gz

uninstall:
	rm -f ../www/scripts/*

.PHONY: all clean test install
