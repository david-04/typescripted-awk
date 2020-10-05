BEGIN {
    IGNORECASE=1
}

#-----------------------------------------------------------------------------------------------------------------------
# Extract JavaDoc comment
#-----------------------------------------------------------------------------------------------------------------------

{
     if (/^\s*\/\/-{10,}\s*$/) {
        content = ""
        source = $0
        while (0 < getline && /^\s*\/\//) {
            content = content "\n"
            source = source "\n" $0
            if (!/^\s*\/\/-{10,}\s*$/) {
                gsub(/^\s*\/\/\s*/, "")
                content = content $0
            }
        }
        processJavaDoc(content)
    }

    print
}

#-----------------------------------------------------------------------------------------------------------------------
# Parse the JavaDoc comment
#-----------------------------------------------------------------------------------------------------------------------

function processJavaDoc(content) {

    if (match(content, /\n\s*@[a-z]+\s/)) {
        processJavaDocWithTags(substr(content, 1, RSTART), substr(content, RSTART))
    } else {
        printJavaDoc(content, content, "", -1, "")
    }
}

function processJavaDocWithTags(longDescription, tags,    shortDescription, exportLevel) {

    if (match(tags, /^\s*@brief\s+/)) {
        sub(/^\s*@brief\s+/, "", tags)
        if (match(tags, /\n\s*@[a-z]+\s/)) {
            shortDescription = substr(tags, 1, RSTART)
            tags = substr(tags, RSTART)
        } else {
            shortDescription = tags
            tags = ""
        }
    } else {
        shortDescription = ""
    }

    if (match(tags, /(^|\n)\s*@level\s*[0-9]\s*/)) {
        exportLevel = substr(tags, RSTART, RLENGTH)
        tags = substr(tags, 1, RSTART) substr(tags, RSTART + RLENGTH)
        gsub(/[^0-9]+/, "", exportLevel)
        exportLevel = exportLevel + 0
    } else {
        exportLevel = -1
    }

    printJavaDoc(shortDescription, longDescription, tags, exportLevel)
}

#-----------------------------------------------------------------------------------------------------------------------
# Print the JavaDoc comment
#-----------------------------------------------------------------------------------------------------------------------

function printJavaDoc(shortDescription, longDescription, tags, exportLevel,    description) {

    if (match(tags, /@brief/)) {
        print "ERROR: @brief must be the first tag within the comment:\n\n" source | "cat 1>&2"
        exit(1)
    }

    description = useShortDescription ? shortDescription : longDescription
    gsub(/(^\s+|\s+$)/, "", description)

    print "/**"
    print description
    if ("" != tags) {
        print ""
        gsub(/(^[\s\n]+|[\s\n]+$)/, "", tags)
        print tags
    }
    print "*/"
    if (0 <= exportLevel && exportLevel <= maxExportLevel + 0) {
        print "export"
    }
}
