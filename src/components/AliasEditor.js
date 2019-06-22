const fs = require("fs");

const AliasEditor = {
    template: fs.readFileSync(path.join(__dirname, "./AliasEditor.html"), "utf-8")
}

module.exports = AliasEditor;