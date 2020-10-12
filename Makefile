#-----------------------------------------------------------------------------------------------------------------------
# List all targets
#-----------------------------------------------------------------------------------------------------------------------

help :
	echo.
	echo test ............. Run all tests
	echo typedoc .......... Generate the API documentation
	echo clean ............ Delete temporary files
	echo.

#-----------------------------------------------------------------------------------------------------------------------
# Settings
#-----------------------------------------------------------------------------------------------------------------------

VERSION=0.0
LEVELS=3

ECMASCRIPT_VERSION=ES5
TSC=tsc --lib $(ECMASCRIPT_VERSION)

JEST=jest --silent --coverage --coverageDirectory=build/test/coverage/unit
JASMINE=jasmine
RUN_TEST=$(JASMINE)

LIBRARY_FOLDERS=$(foreach segment, . * */* */*/* */*/*/* */*/*/*/*, src/library/$(segment))
UNIT_TEST_SOURCES=$(wildcard $(foreach folder, $(LIBRARY_FOLDERS), $(folder)/*.test.ts $(folder)/test-tools/*.ts))
LIBRARY_SOURCES=$(filter-out $(UNIT_TEST_SOURCES), $(wildcard $(foreach folder, $(LIBRARY_FOLDERS), $(folder)/*.ts))) src/library/tsconfig.json

#-----------------------------------------------------------------------------------------------------------------------
# Library
#-----------------------------------------------------------------------------------------------------------------------

build/library/tsawk.ts : $(LIBRARY_SOURCES) build/scripts/get-files-from-tsconfig.js
	echo $@
	rm -rf build/library/src
	mkdir -p build/library/src
	node build/scripts/get-files-from-tsconfig.js src/library/tsconfig.json \
		| grep -viE "(/test-tools/|/test/|\.test\.ts$$)" \
		| sed 's|^|src/library/|' \
		| xargs cat \
		> $@

#-----------------------------------------------------------------------------------------------------------------------
# Unit tests
#-----------------------------------------------------------------------------------------------------------------------

test : build/unit-test/unit-test.js
	echo Running unit tests
	$(RUN_TEST) $^

build/unit-test/unit-test.js : $(LIBRARY_SOURCES) $(UNIT_TEST_SOURCES) build/scripts/process-javadoc.js
	echo $@
	$(TSC) --outFile $@ --project src/library
	node build/scripts/process-javadoc.js test 999 $@

#-----------------------------------------------------------------------------------------------------------------------
# API documentation
#-----------------------------------------------------------------------------------------------------------------------

typedoc : $(foreach level, $(LEVELS), build/api-doc/level-$(level)/index.html);

build/api-doc/level-%/index.html : build/library/tsawk.ts build/scripts/process-javadoc.js
	echo build/api-doc/level-$*.ts
	rm -rf build/api-doc/level-$**
	mkdir -p build/api-doc/level-$*
	cp build/library/tsawk.ts build/api-doc/level-$*.ts
	node build/scripts/process-javadoc.js lib $* build/api-doc/level-$*.ts
	echo build/api-doc/level-$*.js
	$(TSC) --declaration --module commonjs --isolatedModules --outDir build/api-doc build/api-doc/level-$*.ts
	echo build/api-doc/level-$*/index.html
	typedoc --excludeNotExported \
			--includeDeclarations \
			--excludeExternals \
			--theme default \
			--name "typscripted-awk | $(VERSION)-level-$*" \
			--disableSources \
			--readme none \
			--out build/api-doc/level-$* \
			--mode file \
			build/api-doc/level-$*.d.ts
	cat src/resources/typedoc.css >> build/api-doc/level-$*/assets/css/main.css

#-----------------------------------------------------------------------------------------------------------------------
# Build scripts
#-----------------------------------------------------------------------------------------------------------------------

build/scripts/%.js : src/scripts/%.ts src/scripts/tsconfig.json
	echo "build/scripts/*.js"
	$(TSC) --outDir build/scripts --project src/scripts

#-----------------------------------------------------------------------------------------------------------------------
# Clean up temporary files
#-----------------------------------------------------------------------------------------------------------------------

clean :
	rm -r ./build
