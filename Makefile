.SILENT :

#-----------------------------------------------------------------------------------------------------------------------
# List all targets
#-----------------------------------------------------------------------------------------------------------------------

help :
	echo.
	echo test ............. Run all tests
	echo typedoc .......... Generate the API documentation
	echo package .......... Assemble the Node package
	echo typecheck ........ Perform a test compile with node package typings
	echo clean ............ Delete temporary files
	echo.

#-----------------------------------------------------------------------------------------------------------------------
# Settings
#-----------------------------------------------------------------------------------------------------------------------

VERSION=0.0.0
LEVELS=3

ECMASCRIPT_VERSION=ES2019
TSC=tsc -t $(ECMASCRIPT_VERSION) \
		--strict \
		--noImplicitAny \
		--strictNullChecks \
		--strictFunctionTypes \
		--strictBindCallApply \
		--strictPropertyInitialization  \
		--noImplicitThis \
		--alwaysStrict \
		--moduleResolution node

TSC_STRICT=$(TSC) \
		--noUnusedLocals \
		--noUnusedParameters \
		--noImplicitReturns \
		--noFallthroughCasesInSwitch

JEST=jest --silent --coverage --coverageDirectory=build/test/coverage/unit
JASMINE=jasmine
RUN_TEST=$(JASMINE)

LIBRARY_FOLDERS=$(foreach segment, . * */* */*/* */*/*/* */*/*/*/*, src/library/$(segment))
UNIT_TEST_SOURCES=$(wildcard $(foreach folder, $(LIBRARY_FOLDERS), $(folder)/*.test.ts $(folder)/test-tools/*.ts))
LIBRARY_SOURCES=$(filter-out $(UNIT_TEST_SOURCES), $(wildcard $(foreach folder, $(LIBRARY_FOLDERS), $(folder)/*.ts))) src/library/tsconfig.json

#-----------------------------------------------------------------------------------------------------------------------
# build/unit-test
#-----------------------------------------------------------------------------------------------------------------------

test : build/unit-test/unit-test.js
	echo Running unit tests
	$(RUN_TEST) $^

build/unit-test/unit-test.js : build/unit-test/unit-test.ts
	echo $@
	$(TSC_STRICT) --sourceMap --outDir build/unit-test/output build/unit-test/unit-test.ts
	mv -f build/unit-test/output/unit-test.js build/unit-test/
	rm -rf build/unit-test/output

build/unit-test/unit-test.ts : build/library/tsawk.ts $(UNIT_TEST_SOURCES) build/scripts/cat-typescript-sources.js
	echo $@
	mkdir -p build/unit-test
	cp build/library/tsawk.ts $@.tmp
	node build/scripts/cat-typescript-sources.js src/library tsconfig.json test >> $@.tmp
	mv -f $@.tmp $@

#-----------------------------------------------------------------------------------------------------------------------
# build/typedoc
#-----------------------------------------------------------------------------------------------------------------------

typedoc : $(foreach level, $(LEVELS), build/typedoc/level-$(level)/index.html);

build/typedoc/level-%/index.html : build/library/tsawk.ts build/scripts/process-javadoc.js src/resources/typedoc.css
	echo build/typedoc/level-$*.ts
	rm -rf build/typedoc/level-$**
	mkdir -p build/typedoc/level-$*
	cp build/library/tsawk.ts build/typedoc/level-$*.ts
	node build/scripts/process-javadoc.js doc $* build/typedoc/level-$*.ts
	echo build/typedoc/level-$*.js
	$(TSC) --declaration --module commonjs --outDir build/typedoc build/typedoc/level-$*.ts
	echo build/typedoc/level-$*/index.html
	typedoc --excludeNotExported \
			--includeDeclarations \
			--excludeExternals \
			--theme default \
			--name "typscripted-awk | $(VERSION)-level-$*" \
			--disableSources \
			--readme none \
			--out build/typedoc/level-$* \
			--mode file \
			build/typedoc/level-$*.d.ts
	cat src/resources/typedoc.css >> build/typedoc/level-$*/assets/css/main.css

#-----------------------------------------------------------------------------------------------------------------------
# build/library
#-----------------------------------------------------------------------------------------------------------------------

library :  $(foreach level, 0 $(LEVELS) 9, \
	build/library/tsawk-level-$(level).exports \
    build/library/tsawk-level-$(level).d.ts \
    build/library/tsawk-level-$(level).js \
    build/library/tsawk-level-$(level).ts \
);

build/library/tsawk.ts : $(LIBRARY_SOURCES) build/scripts/cat-typescript-sources.js
	echo $@
	mkdir -p build/library
	node build/scripts/cat-typescript-sources.js src/library tsconfig.json source > $@.tmp
	mv -f $@.tmp $@

build/library/tsawk-level-%.js build/library/tsawk-level-%.d.ts : build/library/tsawk.ts build/scripts/process-javadoc.js typecheck
	echo build/library/tsawk-level-$*.js
	rm -f build/library/level-$**
	cp build/library/tsawk.ts build/library/tsawk-level-$*.ts
	node build/scripts/process-javadoc.js lib $* build/library/tsawk-level-$*.ts
	$(TSC) --declaration --module commonjs --outDir build/library build/library/tsawk-level-$*.ts
	cat build/library/tsawk-level-$*.d.ts \
		| sed -E "s/^\s*(declare |export )+//" \
		| sed -E "s/^\{\};//" \
		> build/library/tsawk-level-$*.d.ts.tmp
	mv -f build/library/tsawk-level-$*.d.ts.tmp build/library/tsawk-level-$*.d.ts

build/library/tsawk-level-%.exports : build/library/tsawk-level-%.js
	echo $@
	cat $^ \
		| grep -iE "^exports\\." \
		| grep -viE "(=.*=|void 0|__esModule|injectExports)" \
		| sort \
		| uniq \
		| sed -E "s/^[^.]+\\./    '/g" \
		| sed -E "s/\\s*=.*/',/g" \
		| tr '\n' '\a' \
		| sed 's/,\a$$/\a/' \
		| sed 's/^/[\a/g' \
		| sed 's/$$/]\a/g' \
		| tr '\a' '\n' \
		> $@.tmp
	mv -f $@.tmp $@

#-----------------------------------------------------------------------------------------------------------------------
# build/package
#-----------------------------------------------------------------------------------------------------------------------

package :  $(foreach level, $(LEVELS), 				\
	build/package/package.json		 				\
	build/package/internal/tsawk.js 				\
	build/package/level-$(level)/index.js 			\
	build/package/level-$(level)/index.d.ts 		\
	build/package/level-$(level)/global/index.js 	\
	build/package/level-$(level)/global/index.d.ts 	\
);

build/package/package.json : src/resources/package/package.json
	echo $@
	mkdir -p build/package
	cp $^ $@

build/package/internal/tsawk.js : build/library/tsawk-level-9.js
	echo $@
	mkdir -p build/package/internal
	cp $^ $@

build/package/level-%/index.js : build/library/tsawk-level-%.exports build/library/tsawk-level-0.exports src/resources/package/index.js
	echo $@
	mkdir -p build/package/level-$*
	cat src/resources/package/index.js 						    				 > $@.tmp
	echo "tsawk.injectExports(module.exports," 									>> $@.tmp
	cat build/library/tsawk-level-$*.exports									>> $@.tmp
	echo "," 																	>> $@.tmp
	cat build/library/tsawk-level-0.exports										>> $@.tmp
	echo ");" 																	>> $@.tmp
	mv -f $@.tmp $@

build/package/level-%/global/index.js : build/library/tsawk-level-%.exports src/resources/package/index.js
	echo $@
	mkdir -p build/package/level-$*/global
	cat src/resources/package/index.js | sed 's|../internal|../../internal|'	 > $@.tmp
	echo "tsawk.injectExports(module.exports," 								    >> $@.tmp
	cat build/library/tsawk-level-$*.exports									>> $@.tmp
	echo "," 																	>> $@.tmp
	cat build/library/tsawk-level-$*.exports									>> $@.tmp
	echo ");" 																	>> $@.tmp
	mv -f $@.tmp $@

build/package/level-%/index.d.ts : build/library/tsawk-level-%.d.ts build/library/tsawk-level-0.d.ts
	echo $@
	mkdir -p build/package/level-$*
	echo "declare module 'typescripted-awk/level-$*' {" 						 > $@.tmp
	cat build/library/tsawk-level-$*.d.ts | sed 's/^/    /' 					>> $@.tmp
	echo "    global {" 														>> $@.tmp
	cat build/library/tsawk-level-0.d.ts | sed 's/^/        /' 					>> $@.tmp
	echo "    }" 																>> $@.tmp
	echo "}" 																	>> $@.tmp
	mv -f $@.tmp $@

build/package/level-%/global/index.d.ts : build/package/level-%/index.d.ts
	echo $@
	mkdir -p build/package/level-$*/global
	echo "declare module 'typescripted-awk/level-$*/global' {" 				     > $@.tmp
	cat build/library/tsawk-level-$*.d.ts | sed 's/^/    /' 					>> $@.tmp
	echo "    global {" 														>> $@.tmp
	cat build/library/tsawk-level-$*.d.ts | sed 's/^/        /' 				>> $@.tmp
	echo "    }" 																>> $@.tmp
	echo "}" 																	>> $@.tmp
	mv -f $@.tmp $@

#-----------------------------------------------------------------------------------------------------------------------
# build/temp/typecheck.js
#-----------------------------------------------------------------------------------------------------------------------

typecheck : build/temp/typecheck.js;

build/temp/typecheck.js : src/library/tsconfig.json $(UNIT_TEST_SOURCES) $(LIBRARY_SOURCES) src/library/internal/node-modules.d.ts
	echo $@
	$(TSC) --outFile $@ --project src/library

#-----------------------------------------------------------------------------------------------------------------------
# build/scripts
#-----------------------------------------------------------------------------------------------------------------------

build/scripts/%.js : src/scripts/%.ts src/scripts/tsconfig.json
	echo "build/scripts/*.js"
	$(TSC) --outDir build/scripts --project src/scripts

#-----------------------------------------------------------------------------------------------------------------------
# Clean up temporary files
#-----------------------------------------------------------------------------------------------------------------------

clean :
	rm -rf ./build
