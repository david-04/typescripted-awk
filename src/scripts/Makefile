SOURCES=$(wildcard *.ts)
TARGETS=$(patsubst %.ts, ../../build/scripts/%.js, $(SOURCES))

test : build/scripts/process-javadoc.js
	echo build/scripts/test-data
	rm -rf ../../build/scripts/test-data
	mkdir -p ../../build/scripts/test-data
	echo build/scripts/test-data/sample-javadoc-01-src.js
	cp test-data/sample-javadoc.js ../../build/scripts/test-data/sample-javadoc-01-src.js
	echo build/scripts/test-data/sample-javadoc-02-doc.js
	cp ../../build/scripts/test-data/sample-javadoc-01-src.js ../../build/scripts/test-data/sample-javadoc-02-doc.js
	node ../../build/scripts/process-javadoc.js doc 1 ../../build/scripts/test-data/sample-javadoc-02-doc.js
	echo build/scripts/test-data/sample-javadoc-03-lib.js
	cp ../../build/scripts/test-data/sample-javadoc-01-src.js ../../build/scripts/test-data/sample-javadoc-03-lib.js
	node ../../build/scripts/process-javadoc.js lib 1 ../../build/scripts/test-data/sample-javadoc-03-lib.js

build/scripts/process-javadoc.js : $(SOURCES) tsconfig.json
	echo "build/scripts/*.js"
	rm -rf build/scripts/*.js
	tsc
