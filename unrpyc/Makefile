all: script.json.gz imachine.json.gz

imachine.json.gz: imachine.json

%.json.gz: %.json
	gzip -9c $< > $@
	touch $< $@

script.json: $(patsubst %.rpyc,%.json,$(wildcard *.rpyc))
	cat script-*.json > script.json
	sed -i -e 's/^/{/;s/,$$/}/' script.json

%.json.o: %.rpyc *.py
	python unrpyc.py --clobber $< $@

imachine.json: imachine.json.o
	node fix.js $< $@

%.json: %.json.o
	node fix.js $< $@
	sed -i -e 's/^{//;s/}$$/,/' $@

clean:
	rm -f *.json.o *.json *.gz

test: all
	jshint --show-non-errors *.json

install: all
	install -t ../www/scripts script.json script.json.gz imachine.json imachine.json.gz

.PHONY: all clean test install
.PRECIOUS: imachine.json.o
