all: ids

ids:
	cd webserver && python app.py

preprocess:
	mkdir -p build
	/usr/bin/cpp -P -undef -Wundef -std=c99 -nostdinc -Wtrigraphs -fdollars-in-identifiers src/main.js build/pp_jvm.js

compile: preprocess
	java -jar lib/compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js build/pp_jvm.js --js_output_file build/jvm.js

clean:
	rm -dR build

