const { app, dialog } = require("electron").remote; 
const fs = require("fs");

const APP_DATA_PATH = app.getPath("userData");

var Home = {
    data: function () {
        return {
            profileModal: {
                name: "",
                filepath: ""
            },
            filePathExists: false,
            aliasFiles: []
        };
    },
    template: fs.readFileSync(path.join(__dirname, ".././HomeEditor.html"), "utf-8"),
    methods: {
        checkAliasFiles: function() {
            // Check if each alias file still exists.
            this.aliasFiles.forEach((alias, index) => {
                if (!fs.existsSync(alias.filepath)) {
                    this.aliasFiles[index].exists = false;
                } else {
                    this.aliasFiles[index].exists = true;
                }
            });
        },
        createAliasProfile: function (e) {
            if (this.profileModal.filepath.length > 0) {
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

                let modal = document.querySelector("#newProfileModal"),
                    modalInstance = M.Modal.init(modal);
                
                modalInstance.close();
                this.editAlias(this.aliasFiles.length - 1);
            } else {
                this.filePathExists = false;
            }
        },
        deleteAliasProfile: function (id) {
            this.aliasFiles.splice(id, 1);
        },
        openAliasDialog: function () {
            dialog.showOpenDialog({
                title: "Alias File...",
                filters: [
                    { name: "Alias File", extensions: ["txt", "buddyalias"] }
                ]
            }, (filePaths) => {
                if (filePaths) {
                    this.profileModal.filepath = filePaths[0];
                    this.filePathExists = true;
                }
            });
        },
        editAlias: function (id) {
            router.push({ path: "/alias-editor/alias/" + id, query: { aliasFileData: this.aliasFiles[id] } });
        }
    },
    created: function () {
        this.aliasFiles = USER_DATA.aliasFiles;

        this.checkAliasFiles();
    },
    mounted: function () {
        this.$nextTick(function () {
            M.AutoInit();
        });
    },
    watch: {
        aliasFiles: function (val) {
            USER_DATA.aliasFiles = val;

            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(USER_DATA), function (err) {
                if (err) throw err;
            });
        }
    }
};

module.exports = Home;