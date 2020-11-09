import * as fs from "fs";

//----------------------------------------------------------------------------------------------------------------------
// Data types
//----------------------------------------------------------------------------------------------------------------------

type CodeSection = { content: string, isComment: boolean };
type Comment = { description: string, annotations: Array<{ tag: string, content: string }> };

//----------------------------------------------------------------------------------------------------------------------
// Store the previous comment in case it needs to be repeated)
//----------------------------------------------------------------------------------------------------------------------

let previousComment: { comment: string, mustExport: boolean } | undefined = undefined;

//----------------------------------------------------------------------------------------------------------------------
// Command line parameters
//----------------------------------------------------------------------------------------------------------------------

const parameters = {
    type: process.argv[2] as "doc" | "lib" | "test",
    level: parseInt(process.argv[3])
}

//----------------------------------------------------------------------------------------------------------------------
// Process all files.
//----------------------------------------------------------------------------------------------------------------------

for (let index = 4; index < process.argv.length; index++) {
    const file = process.argv[index];
    const content = processFileContent(fs.readFileSync(file, "utf8").replace(/\r/g, ""));
    fs.writeFileSync(file, content);
}

//----------------------------------------------------------------------------------------------------------------------
// Process the contents of a single file.
//----------------------------------------------------------------------------------------------------------------------

function processFileContent(content: string) {

    const segments = splitCodeAndJavaDocComments(content);
    moveLineBreaksBeforeCommentsToPrecedingSection(segments);
    removeEmptyLinesAfterComments(segments);
    removeCommentsWithoutCode(segments);

    for (let index = 0; index < segments.length; index++) {
        if (segments[index].isComment) {
            try {
                const transformedComment = transformComment(segments[index].content);
                segments[index].content = transformedComment.comment;
                if (transformedComment.mustExport && index + 1 < segments.length && !segments[index + 1].isComment) {
                    segments[index + 1].content = insertExportStatement(segments[index + 1].content);
                }
            } catch (error) {
                throw new Error(`${error}\n\n${segments[index].content}\n`);
            }
        }
    }

    return segments.map(segment => segment.content).join("");
}

//----------------------------------------------------------------------------------------------------------------------
// Segment the file content into sections of either code or comments (which start at the beginning of the line).
//----------------------------------------------------------------------------------------------------------------------

function splitCodeAndJavaDocComments(content: string) {

    let segments = new Array<CodeSection>();
    let match: RegExpMatchArray | null = null;

    segments.push({ content: "", isComment: false });
    while (match = content.match(/((^|\n)[ \t]*\/\/[^\n]*)+|(^|\n)[ \t]*\/\*\*([^*]|\*[^/])*\*\//)) {
        if (0 < match.index!) {
            segments.push({ content: content.substr(0, match.index!), isComment: false });
        }
        segments.push({ content: match[0], isComment: true });
        content = content.substr((match.index ?? 0) + match[0].length);
    }
    segments.push({ content, isComment: false });

    return segments;
}

//----------------------------------------------------------------------------------------------------------------------
// Move line breaks before comments to the preceding block and remove line breaks after a comment block
//----------------------------------------------------------------------------------------------------------------------

function moveLineBreaksBeforeCommentsToPrecedingSection(sections: CodeSection[]) {

    for (let index = 1; index < sections.length; index++) {
        if (sections[index].isComment) {
            const match = sections[index].content.match(/^\s*\n/);
            if (match && match[0]) {
                sections[index - 1].content += match[0];
                sections[index].content = sections[index].content.substr(match[0].length);
            }
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Remove extra empty lines after each comment.
//----------------------------------------------------------------------------------------------------------------------

function removeEmptyLinesAfterComments(sections: CodeSection[]) {

    for (let index = 1; index < sections.length; index++) {
        if (sections[index - 1].isComment) {
            sections[index].content = sections[index].content.replace(/^([ \t]*\n)+/, "\n");
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Remove comments that are not followed by another comment (without any code in between).
//----------------------------------------------------------------------------------------------------------------------

function removeCommentsWithoutCode(sections: CodeSection[]) {

    for (let index = 0; index < sections.length; index++) {
        if (sections[index].isComment) {
            if (index + 1 === sections.length || sections[index + 1].isComment || !sections[index + 1].content.trim()) {
                sections.splice(index--, 1);
            }
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Transform and render the comment
//----------------------------------------------------------------------------------------------------------------------

function transformComment(content: string) {

    const indent = content.match(/^\s*/)![0] ?? "";
    content = content.substr(indent.length);
    content = removeCommentDelimiters(content);
    const comment = splitCommentIntoDescriptionAndTags(content);

    if (comment.annotations.filter(annotation => "@repeat" === annotation.tag).length) {
        if (previousComment) {
            return previousComment;
        } else {
            throw new Error("Found @repeat without preceding comment");
        }
    }

    const mustExport = processTags(comment);
    const result = { comment: renderComment(comment, indent), mustExport };
    if (!content.match(/^\s*@ts-/)) {
        previousComment = result;
    }
    return result;
}

//----------------------------------------------------------------------------------------------------------------------
// Remove comment delimiters (//, /*, /** and */).
//----------------------------------------------------------------------------------------------------------------------

function removeCommentDelimiters(comment: string) {

    if (comment.match(/^\/\//)) {
        return comment
            .replace(/^\/\/[ \t]?(-{10,})?/, "")
            .replace(/\n[ \t]*\/\/[ \t]?(-{10,})?/g, "\n")
            .trim();
    } else if (comment.match(/^\/\*/)) {
        return comment
            .replace(/^\/\*\*?[ \t]?/, "")
            .replace(/\*\/$/, "")
            .replace(/\n[ \t]*\*[ \t]?/g, "\n")
            .trim();
    } else {
        throw new Error("Unable to determine the comment type (// or /* */)")
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Split a comment block into the description and and optional sequence of tags.
//----------------------------------------------------------------------------------------------------------------------

function splitCommentIntoDescriptionAndTags(content: string) {

    let description = "";
    const annotations = new Array<{ tag: string, content: string }>();

    const lines = content.split("\n");
    for (let index = 0; index < lines.length; index++) {
        if (lines[index].match(/^\s*@[a-z]+(\s|$)/i)) {
            annotations.push({
                tag: lines[index].replace(/^\s*/, "").replace(/\s.*/, "").trim(),
                content: lines[index].replace(/^\s*@[a-z]+\s+/i, "").trim()
            });
        } else if (annotations.length) {
            annotations[annotations.length - 1].content += `\n${lines[index]}`;
        } else {
            description += (description ? "\n" : "") + lines[index];
        }
    }

    return { description, annotations };
}

//----------------------------------------------------------------------------------------------------------------------
// Apply and replace tags if/as required.
//----------------------------------------------------------------------------------------------------------------------

function processTags(comment: Comment) {

    processBriefTag(comment);
    processReturnTag(comment);
    processThrowTag(comment);
    processTypeTag(comment);
    const mustExport = processLevelTag(comment);
    validateTags(comment.annotations.map(annotation => annotation.tag));
    return mustExport;
}

//----------------------------------------------------------------------------------------------------------------------
// Replace the description with the @brief summary (unless generating documentation) and remove the @brief tag.
//----------------------------------------------------------------------------------------------------------------------

function processBriefTag(comment: Comment) {

    for (let index = 0; index < comment.annotations.length; index++) {
        if ("@brief" === comment.annotations[index].tag) {
            if ("doc" !== parameters.type) {
                comment.description = comment.annotations[index].content;
            }
            comment.annotations.splice(index--, 1);
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Remove the @return tag (unless generating documentation).
//----------------------------------------------------------------------------------------------------------------------

function processReturnTag(comment: Comment) {

    if ("doc" !== parameters.type) {
        for (let index = 0; index < comment.annotations.length; index++) {
            if ("@return" === comment.annotations[index].tag) {
                comment.annotations.splice(index--, 1);
            }
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Remove the @throw(s) tag.
//----------------------------------------------------------------------------------------------------------------------

function processThrowTag(comment: Comment) {

    for (let index = 0; index < comment.annotations.length; index++) {
        if ("@throw" === comment.annotations[index].tag || "@throws" === comment.annotations[index].tag) {
            comment.annotations.splice(index--, 1);
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Replace @type with @typeParam for the documentation and remove it otherwise.
//----------------------------------------------------------------------------------------------------------------------

function processTypeTag(comment: Comment) {

    for (let index = 0; index < comment.annotations.length; index++) {
        if ("@type" === comment.annotations[index].tag) {
            if ("doc" === parameters.type) {
                comment.annotations[index].tag = "@typeParam";
            } else {
                comment.annotations.splice(index--, 1);
            }
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Remove the @level tag and decide if the item needs to be exported.
//----------------------------------------------------------------------------------------------------------------------

function processLevelTag(comment: Comment) {

    let mustExport = false;

    for (let index = 0; index < comment.annotations.length; index++) {
        if ("@level" === comment.annotations[index].tag) {
            const level = comment.annotations[index].content.trim();
            if (!level.match(/^[0-9]+$/)) {
                throw new Error(`Unknown value for @level ${level}`);
            }
            mustExport ||= "test" !== parameters.type && parseInt(level) <= parameters.level;
            comment.annotations.splice(index--, 1);
        }
    }

    return mustExport;
}

//----------------------------------------------------------------------------------------------------------------------
// Verify that only known tags are being used.
//----------------------------------------------------------------------------------------------------------------------

function validateTags(usedTags: string[]) {

    const knownTags = ["param", "return", "typeParam"];
    const unknownTags = usedTags.filter(tag => !knownTags.filter(knownTag => `@${knownTag}` === tag).length).join(", ");
    if (unknownTags.length) {
        throw new Error(`Unsupported tag${1 === unknownTags.length ? "" : "s"}: ${unknownTags}`)
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Render the comment into standard JavaDoc format.
//----------------------------------------------------------------------------------------------------------------------

function renderComment(comment: Comment, indent: string) {

    const tags = comment.annotations.map(annotation => `\n${annotation.tag} ${annotation.content.trim()}`).join("");
    const content = `${comment.description}${tags}`.trim();
    if (0 <= content.indexOf("\n")) {
        return content.replace(/^/, `${indent}/**\n`).replace(/\n/g, `\n${indent} * `).replace(/$/, `\n${indent} */`);
    } else if (content.trim()) {
        return `/** ${content.trim()} */`;
    } else {
        return "";
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Insert the export command ad the beginning of the code block.
//----------------------------------------------------------------------------------------------------------------------

function insertExportStatement(content: string) {

    const match = content.match(/[^\s]/);
    if (match && "number" === typeof match.index) {
        content = `${content.substr(0, match.index)}export ${content.substr(match.index)}`;
    }
    return content;
}
