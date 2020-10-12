import * as fs from 'fs';

const file = process.argv[2];
const json = JSON.parse(fs.readFileSync(file, 'utf8').replace(/\/\/[^\n]*/g, ''));

if (Array.isArray(json.files) && json.files.length) {
    for (let index = 0; index < json.files.length; index++) {
        console.log(json.files[index]);
    }
} else {
    throw new Error(`${file} does not contain any files`);
}
