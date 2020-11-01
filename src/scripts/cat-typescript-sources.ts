import * as fs from "fs";

getFilesFromTsconfigJson(`${process.argv[2]}/${process.argv[3]}`)
    .filter(file => ("test" === process.argv[4]) === !!file.match(/(\/test\/|\.test\.|source-map-support)/))
    .map(file => processSourceFile(process.argv[2], file));

//----------------------------------------------------------------------------------------------------------------------
// Load tsconfig.json and extract the "files" array.
//----------------------------------------------------------------------------------------------------------------------

function getFilesFromTsconfigJson(file: string) {

    const json = JSON.parse(fs.readFileSync(file, "utf8").replace(/\/\/[^\n]*/g, ""));
    if (Array.isArray(json.files) && json.files.length) {
        return json.files as Array<string>;
    } else {
        throw new Error(`ERROR: ${file} does not contain any files`);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Load and print the content of a file.
//----------------------------------------------------------------------------------------------------------------------

function processSourceFile(folder: string, file: string) {

    fs.readFileSync(`${folder}/${file}`, "utf8")
        .split(/\r?\n/)
        .map((line, index) => line.replace(/__FILE__/g, file).replace(/__LINE__/g, `${index + 1}`))
        .map(line => line.match(/reference path.*node-modules.d.ts/) ? "" : line)
        .map(line => line.replace(/typeof\s+_NodeModuleTypes\.[^\s]+/ig, "any"))
        .forEach(line => console.log(line));
}
