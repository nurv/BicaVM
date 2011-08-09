 
SRCS=$(wildcard src/*.js)

OBJS=$(SRCS:.js=.jspp)

all: ids

ids:
	cd webserver && python app.py

%.jspp: %.js
	cpp -P -undef -CC -Wundef -std=c99 -nostdinc -Wtrigraphs -fdollars-in-identifiers $< `echo $@ | sed s/src/build/`

builddir:
	mkdir -p build

preprocess: builddir $(OBJS)        

compile: preprocess
	java -jar lib/compiler.jar --warning_level VERBOSE --compilation_level ADVANCED_OPTIMIZATIONS `find build/ -name *.jspp -exec echo --js {} \;` --js_output_file build/jvm.js

clean:
	rm -dR build

