all: $(patsubst %.rpyc,%.json,$(wildcard *.rpyc))

%.json.o: %.rpyc *.py
	python unrpyc.py --clobber $< $@

%.json: %.json.o
	node fix.js $< $@

clean:
	rm -f *.json.o *.json

test: all
	jshint --show-non-errors *.json

.PHONY: all clean test
.PRECIOUS: %.json.o
