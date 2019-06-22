var _a = require("electron").remote, dialog = _a.dialog, app = _a.app;
var fs = require("fs");
//const M = require("materialize-css")
var APP_DATA_PATH = app.getPath("userData");
var noob = true;
var BASE_USER_DATA = {};
var Home = {
    data: function () {
        return {
            profileModal: {
                name: "",
                filepath: ""
            },
            aliasFiles: []
        };
    },
    template: fs.readFileSync(path.join(__dirname, ".././HomeEditor.html"), "utf-8"),
    methods: {
        createAliasProfile: function () {
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
        deleteAliasProfile: function (id) {
            this.aliasFiles.splice(id, 1);
        },
        openAliasDialog: function () {
            var _this = this;
            dialog.showOpenDialog({
                title: "Alias File...",
                filters: [
                    { name: "Alias File", extensions: ["txt"] }
                ]
            }, function (filePaths) {
                if (filePaths) {
                    _this.profileModal.filepath = filePaths[0];
                }
            });
        },
        editAlias: function (id) {
            router.push({ path: "/alias-editor/alias/" + id, query: { aliasFileData: this.aliasFiles[id] } });
        }
    },
    created: function () {
        var _this = this;
        /**
         * Read user-data file to retrieve alias profiles created.
         */
        fs.readFile(APP_DATA_PATH + "/user-data.json", function (err, data) {
            if (err)
                throw err;
            BASE_USER_DATA = JSON.parse(data);
            _this.aliasFiles = BASE_USER_DATA.aliasFiles;
            /**
             * Check if the alias files still exist.
             */
            _this.aliasFiles.forEach(function (alias, index) {
                if (!fs.existsSync(alias.filepath)) {
                    _this.aliasFiles[index].exists = false;
                }
            });
        });
    },
    mounted: function () {
        this.$nextTick(function () {
            M.AutoInit();
        });
    },
    watch: {
        aliasFiles: function (val) {
            BASE_USER_DATA.aliasFiles = val; // Update BASE alias data;
            fs.writeFile(APP_DATA_PATH + "/user-data.json", JSON.stringify(BASE_USER_DATA), function (err) {
                if (err)
                    throw err;
            });
        }
    }
};
module.exports = Home;
