GZIP := $(shell ./find-gzip.sh)

TARGETS := script.json script.json.gz imachine.json imachine.json.gz imachine_replay.json imachine_replay.json.gz ui-strings.json ui-strings.json.gz ui-strings_FR.json ui-strings_FR.json.gz

all: $(TARGETS)

%.json.gz: %.json
	$(GZIP) -c $< > $@
	touch $< $@

script.json: $(patsubst %.rpyc,%.json,$(wildcard script-*.rpyc))
	cat script-*.json > script.json
	sed -i -e 's/^/{/;s/,$$/}/' script.json

%.json: %.json.o
	node fix.js $< $@

ui-strings.json.o ui-strings_FR.json.o: ui-strings%.json.o: ui-strings%.rpyc *.py
	python unrpyc.py --clobber $< $@
	sed -i -e 's/    \["init_language", "[a-z]*", \],//;s/^\]}$$/}/' $@

ui_settings.json.o: ui_settings.rpyc *.py
	python unrpyc.py --clobber $< --ignore-python $@
	sed -i -e 's/,,/,/g;/: *,$$/d' $@

%.json.o: %.rpyc *.py
	python unrpyc.py --clobber $< $@

script-%.json: script-%.json.o
	node fix.js $< $@
	sed -i -e 's/^{//;s/}$$/,/' $@

clean:
	$(RM) *.json*

test: all
	jshint --show-non-errors *.json

install: all
	[ -d ../www/json ] || mkdir ../www/json
	install $(TARGETS) ../www/json

uninstall:
	$(RM) ../www/json/*

.PHONY: all clean test install
