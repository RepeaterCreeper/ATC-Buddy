const fs = require("fs");
const virtualList = require("vue-virtual-scroll-list");

const APP_DATA_PATH = app.getPath("userData");

const Alias = {
    props: ["id"],
    data() {
        return {
            aliasFileData: this.$route.query.aliasFileData,
            commandsEditorContentStore: "",
            commandsEditorContent: "",
            commandsListContents: [],
            isUpdateAvailable: false,
            automaticSave: true
        }
    },
    methods: {
        updateAlias: function(){
            fs.writeFile(this.aliasFileData.filepath, this.commandsEditorContent, (err) => {
                if (err) throw err;

                this.isUpdateAvailable = false;
            });
        },
        parseAlias: function(data) {
            let temp = [
                {
                    name: "",
                    commands: []
                }
            ];
            
            data.split("\n").forEach(function (line, index) {
                if (line.substring(0, 1) == ".") {
                    let command = line.substring(1).split(" ")[0],
                        description = line.substring(1).split(" ").slice(1).join(" ");

                    if (temp.length == 1) {
                        temp[0].commands.push([command, description, index]);
                    } else {
                        temp[temp.length - 1].commands.push([command, description, index]);
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
        }
    },
    template: fs.readFileSync(path.join(__dirname, ".././MainEditor.html"), "utf-8"),
    created: function(){

        let { filepath } = this.$route.query.aliasFileData;
        
        fs.readFile(filepath, "utf-8", (err, data) => {
            if (err) {
                // Navigate back and display error;
                router.navigate(-1);

                throw err;
            };

            this.commandsEditorContent = data;
            this.commandsEditorContentStore = data;
        });
    },
    watch: {
        commandsEditorContent: function(newVal) {
            this.isUpdateAvailable = this.commandsEditorContentStore == newVal ? false : true;

            this.parseAlias(newVal);
        }
    },
    mounted: function(){
        this.$nextTick(function(){
            M.AutoInit();
        });
    },
    components: {
        'virtual-list': virtualList
    }
}

module.exports = Alias;