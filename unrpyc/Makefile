all: $(patsubst %.rpyc,%.json,$(wildcard *.rpyc))

%.json.o: %.rpyc *.py
	python unrpyc.py --clobber $< $@

%.json: %.json.o
	node fix.js $< $@

clean:
	rm -f *.json.o *.json

test: all
	jshint --show-non-errors *.json

install: all
	install -t ../www/scripts *.json

.PHONY: all clean test install
