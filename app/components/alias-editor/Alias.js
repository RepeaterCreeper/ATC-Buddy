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

            let temp = [
                {
                    name: "",
                    commands: []
                }
            ];

            data.split("\n").forEach(function (line) {
                if (line.substring(0, 1) == ".") {
                    let command = line.substring(1).split(" ")[0],
                        description = line.substring(1).split(" ").slice(1).join(" ");

                    if (temp.length == 1) {
                        temp[0].commands.push([command, description]);
                    } else {
                        temp[temp.length - 1].commands.push([command, description]);
                    }
                } else if (line.substring(0, 1) == "#") {
                    if (temp.length == 1 && temp[0].name.length == 0) {
                        temp[0].name = line.substr(1).trim()
                    } else {
                        temp.push({
                            name: line.substr(1).trim(),
                            commands: []
                        });
                    }
                }
            });

            this.commandsListContents = temp;
        });
    },
    mounted: function(){
        this.$nextTick(function(){
            M.AutoInit();
        });
    }
}

module.exports = Alias;