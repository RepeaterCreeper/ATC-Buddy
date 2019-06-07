const fs = require("fs");

const AliasEditor = {
    template: fs.readFileSync(path.join(__dirname, "../templates/AliasEditor.html"), "utf-8")
}

module.exports = AliasEditor;