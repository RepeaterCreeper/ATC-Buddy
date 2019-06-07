const { dialog, app } = require("electron").remote;
const fs = require("fs");
//const M = require("materialize-css")

const APP_DATA_PATH = app.getPath("userData");

let BASE_USER_DATA = {};

const Home = {
    data: function() {
        return {
            profileModal: {
                name: "",
                filepath: ""
            },
            aliasFiles: []
        }
    },
    template: fs.readFileSync(path.join(__dirname, "../../templates/HomeEditor.html"), "utf-8"),
    methods: {
        createAliasProfile: function() {
            this.profileModal.name = this.profileModal.name.length > 0 ? this.profileModal.name : "Untitled Profile";

            this.aliasFiles.push({
                name: this.profileModal.name,
                filepath: this.profileModal.filepath,
                exists: true
            });

            /**
             * Reset Profile Modal Data
             */
            this.profileModal.name = "";
            this.profileModal.filepath = "";
        },
        deleteAliasProfile: function(id) {
            this.aliasFiles.splice(id, 1);
        },
        openAliasDialog: function() {
            dialog.showOpenDialog({
                title: "Alias File...",
                filters: [
                    { name: "Alias File", extensions: ["txt"] }
                ]
            }, (filePaths) => {
                if (filePaths) {
                    this.profileModal.filepath = filePaths[0];
                }
            });
        },
        editAlias: function(id) {
            router.push({ path: `/alias-editor/alias/${id}`, query: { aliasFileData: this.aliasFiles[id]}})
        }
    },
    created() {
        /**
         * Read user-data file to retrieve alias profiles created.
         */
        fs.readFile(`${APP_DATA_PATH}/user-data.json`, (err, data) => {
            if (err) throw err;

            BASE_USER_DATA = JSON.parse(data);

            this.aliasFiles = BASE_USER_DATA.aliasFiles;

            /**
             * Check if the alias files still exist.
             */
            this.aliasFiles.forEach((alias, index) => {
                if (!fs.existsSync(alias.filepath)) {
                    this.aliasFiles[index].exists = false;
                }
            })
        });
    },
    mounted() {
        this.$nextTick(function(){
            M.AutoInit();
        })
    },
    watch: {
        aliasFiles: function(val) {
            BASE_USER_DATA.aliasFiles = val; // Update BASE alias data;

            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(BASE_USER_DATA), (err) => {
                if (err) throw err;
            });
        }
    }
}

module.exports = Home;