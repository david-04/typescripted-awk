#-----------------------------------------------------------------------------------------------------------------------
# List all targets
#-----------------------------------------------------------------------------------------------------------------------

help :
	echo.
	echo test ............. Run all tests
	echo doc .............. Generate the API documentation
	echo clean ............ Delete temporary files
	echo.

#-----------------------------------------------------------------------------------------------------------------------
# Variables
#-----------------------------------------------------------------------------------------------------------------------

VERSION=0.0
LEVELS=3
LIBRARY_FOLDERS=$(foreach segment, . * */* */*/* */*/*/* */*/*/*/*, src/library/$(segment))
UNIT_TEST_SOURCES=$(wildcard $(foreach folder, $(LIBRARY_FOLDERS), $(folder)/*.test.ts))
LIBRARY_SOURCES=$(filter-out $(UNIT_TEST_SOURCES), $(wildcard $(foreach folder, $(LIBRARY_FOLDERS), $(folder)/*.ts)))

#-----------------------------------------------------------------------------------------------------------------------
# Unit tests
#-----------------------------------------------------------------------------------------------------------------------

JEST=jest --silent --coverage --coverageDirectory=build/test/coverage/unit
JASMINE=jasmine
TEST_BACKEND=$(JASMINE)

test : build/test/unit-test.js
	echo Running unit tests
	$(TEST_BACKEND) $^

build/test/unit-test.js : $(LIBRARY_SOURCES) $(UNIT_TEST_SOURCES)
	echo $@
	tsc --build src/library/tsconfig.json

#-----------------------------------------------------------------------------------------------------------------------
# API documentation
#-----------------------------------------------------------------------------------------------------------------------

doc docs : $(foreach level, $(LEVELS), build/api-doc/level-$(level)/index.html);

build/api-doc/level-%/index.html : $(LIBRARY_SOURCES) src/build-scripts/preprocess-javadoc.awk src/build-scripts/typedoc.css
	echo build/api-doc/level-$*.ts
	mkdir -p build/api-doc
	awk -f src/build-scripts/preprocess-javadoc.awk \
		-vuseShortDescription=0 \
		-vmaxExportLevel=$* \
		$(LIBRARY_SOURCES) \
		> build/api-doc/level-$*.ts
	echo build/api-doc/level-$*.d.ts
	tsc --declaration build/api-doc/level-$*.ts
	echo $@
	rm -rf build/api-doc/level-$*
	typedoc --excludeNotExported \
			--includeDeclarations \
			--excludeExternals \
			--theme default \
			--name "typscripted-awk | $(VERSION)-level-$*" \
			--disableSources \
			--categorizeByGroup true \
			--readme none \
			--out build/api-doc/level-$* \
			--mode file \
			build/api-doc/level-$*.d.ts
	cat src/build-scripts/typedoc.css >> build/api-doc/level-$*/assets/css/main.css

#-----------------------------------------------------------------------------------------------------------------------
# Clean up temporary files
#-----------------------------------------------------------------------------------------------------------------------

clean :
	rm -r ./build
