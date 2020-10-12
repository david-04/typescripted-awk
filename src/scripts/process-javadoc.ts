import * as fs from 'fs';

//----------------------------------------------------------------------------------------------------------------------
// Extract command line parameters
//----------------------------------------------------------------------------------------------------------------------

const parameters = {
    type: process.argv[2] as 'doc' | 'lib' | 'test',
    level: parseInt(process.argv[3])
}

//----------------------------------------------------------------------------------------------------------------------
// Read the source file
//----------------------------------------------------------------------------------------------------------------------

for (let index = 4; index < process.argv.length; index++) {
    const file = process.argv[index];
    const content = processFileContent(fs.readFileSync(file, 'utf8'));
    fs.writeFileSync(file, content);
}

//----------------------------------------------------------------------------------------------------------------------
// Process the file
//----------------------------------------------------------------------------------------------------------------------

function processFileContent(content: string) {

    content = content.replace(/\r/g, '');
    let result = '';
    let match: RegExpMatchArray | null = null;

    while (match = content.match(/((^|\n)[ \t]*\/\/[^\n]*)+|(^|\n)[ \t]*\/\*\*([^*]|\*[^/])*\*\//)) {
        result += content.substr(0, match.index);
        const comment = match[0];
        try {
            result += comment.match(/^\s*\/\/\//) ? comment : transformComment(comment);
        } catch (error) {
            throw new Error(`${error}\n\n${comment.replace(/^([ \t]*\n)/, '')}\n`);
        }
        content = content.substr((match.index as number) + comment.length);
    }

    return `${result}${content}`;
}

//----------------------------------------------------------------------------------------------------------------------
// Transform a single comment
//----------------------------------------------------------------------------------------------------------------------

function transformComment(comment: string) {

    comment = removeCommentSymbols(comment);
    const sections = splitComment(comment);
    let exportStatement = '';

    for (let index = 1; index < sections.length; index++) {
        if ('@brief' === sections[index].tag) {
            sections[index].tag = eraseText(sections[index].tag);
            if ('doc' !== parameters.type) {
                sections[0].content = eraseText(sections[0].content) + sections[index].content;
            }
            sections[index].content = eraseText(sections[index].content);
        }
        if ('@level' === sections[index].tag) {
            const level = sections[index].content.trim();
            if (!level.match(/[1-9]/)) {
                throw new Error('Unknown value for @level');
            }
            sections[index].tag = eraseText(sections[index].tag);
            sections[index].content = eraseText(sections[index].content);
            if (parseInt(level) <= parameters.level) {
                if ('test' !== parameters.type) {
                    exportStatement = 'export';
                }
            } else if ('doc' === parameters.type) {
                sections[index].tag = '@hidden';
            }
        }
    }

    validateTags(sections.map(section => section.tag).filter(tag => tag));

    return `/** ${sections.map(section => `${section.tag}${section.content}`).join('')} */ ${exportStatement}`;
}

//----------------------------------------------------------------------------------------------------------------------
// Verify that only known tags are used.
//----------------------------------------------------------------------------------------------------------------------

function validateTags(usedTags: Array<string>) {

    const knownTags = ['brief', 'param', 'returns', 'level', 'hidden', 'trows'];
    const unknownTags = usedTags.filter(tag => !knownTags.filter(knownTag => `@${knownTag}` === tag).length).join(', ');
    if (unknownTags) {
        throw new Error(`Unsupported tag(s): ${unknownTags}`)
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Remove //, /** and */ from the comment.
//----------------------------------------------------------------------------------------------------------------------

function removeCommentSymbols(comment: string) {

    if (comment.match(/^[\s\n]*\/\*\*/)) {
        return comment.replace(/\/\*\*/, '').replace(/\*\/$/, '').replace(/\n[ \t]*\*/g, '\n');
    } else if (comment.match(/^[\s\n]*\/\//)) {
        return comment.replace(/^[ \t]*\/\/(-{10,})?/, '').replace(/\n[ \t]*\/\/(-{10,})?/g, '\n');
    } else {
        throw new Error('Unrecognized comment type');
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Split the comment into its sections (description and tags).
//----------------------------------------------------------------------------------------------------------------------

function splitComment(comment: string) {

    let segments = [{ tag: '', content: comment }];

    let match: RegExpMatchArray | null = null;

    while (match = segments[segments.length - 1].content.match(/(^|\n)[ \t]*@[a-z]+/i)) {
        const spaceBefore = match[0].replace(/@.*/, '');
        const tag = match[0].replace(/^[\n\s]*/, '');
        const content = segments[segments.length - 1].content.substr(match.index as number + match[0].length)
        segments[segments.length - 1].content = segments[segments.length - 1].content.substr(0, match.index as number) + spaceBefore;
        segments.push({ tag, content });
    }

    return segments
}

//----------------------------------------------------------------------------------------------------------------------
// Erase everything except line breaks.
//----------------------------------------------------------------------------------------------------------------------

function eraseText(content: string) {
    return content.replace(/[^\n]/g, '');
}
