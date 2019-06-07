const fs = require("fs");

const APP_DATA_PATH = app.getPath("userData");

const Alias = {
    props: ["id"],
    data() {
        return {
            commandsListContents: []
        }
    },
    template: fs.readFileSync(path.join(__dirname, "../../templates/MainEditor.html"), "utf-8"),
    created: function(){
        let { filepath } = this.$route.query.aliasFileData;
        
        fs.readFile(filepath, "utf-8", (err, data) => {
            if (err) throw err;

            let temp = [];

            data.split("\n").forEach(function (line) {
                if (line.substring(0, 1) == ".") {
                    let command = line.substring(1).split(" ")[0],
                        description = line.substring(1).split(" ").slice(1).join(" ");

                    temp.push({
                        type: "command",
                        content: [command, description]
                    });
                } else if (line.substring(0, 1) == "#") {
                    temp.push({
                        type: "header",
                        content: line.substr(1)
                    });
                }
            });

            this.commandsListContents = temp;

            console.log(this.commandsListContents);
        });
    },
    mounted: function(){
        this.$nextTick(function(){
            M.AutoInit();
        });
    }
}

module.exports = Alias;