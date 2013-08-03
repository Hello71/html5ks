all: script.json.gz

script.json.gz: script.json
	gzip -9c script.json > script.json.gz
	touch script.json script.json.gz

script.json: $(patsubst %.rpyc,%.json,$(wildcard *.rpyc))
	cat script-*.json > script.json
	sed -i -e 's/^/{/;s/,$$/}/' script.json

script-%.json.o: script-%.rpyc *.py
	python unrpyc.py --clobber $< $@

script-%.json: script-%.json.o
	node fix.js $< $@
	sed -i -e 's/^{//;s/}$$/,/' $@

clean:
	rm -f *.json.o *.json script.json.gz

test: all
	jshint --show-non-errors *.json

install: all
	install -t ../www/scripts script.json script.json.gz

.PHONY: all clean test install
