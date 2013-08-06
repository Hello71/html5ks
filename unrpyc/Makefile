all: script.json.gz imachine.json.gz

imachine.json.gz: imachine.json

script.json.gz: script.json
	gzip -9c script.json > script.json.gz
	touch script.json script.json.gz

script.json: $(patsubst %.rpyc,%.json,$(wildcard *.rpyc))
	cat script-*.json > script.json
	sed -i -e 's/^/{/;s/,$$/}/' script.json

%.json.o: %.rpyc *.py
	python unrpyc.py --clobber $< $@

%.json: %.json.o
	node fix.js $< $@
	sed -i -e 's/^{//;s/}$$/,/' $@

clean:
	rm -f *.json.o *.json *.gz

test: all
	jshint --show-non-errors *.json

install: all
	install -t ../www/scripts script.json script.json.gz

.PHONY: all clean test install
.PRECIOUS: imachine.json.o
