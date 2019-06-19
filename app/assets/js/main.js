const fs = require("fs");
const { app } = require("electron").remote;
const path = require("path");
const rp = require("request-promise");
const cheerio = require("cheerio");
const Vue = require("vue/dist/vue.common");
const VueRouter = require("vue-router");

Vue.use(VueRouter);

/**
 * Setup
 */
const INFO_TOOL_DATA = require("./assets/data/data");
const APP_DATA_PATH = app.getPath("userData");

const router = require("./assets/js/router.js");

/* const USER_DATA = Vuex.Store({
    state: {
        aliasFiles: [],
        preferences: {
            darkTheme: false
        }
    },
    mutations: {
        toggleDarkTheme(state) {
            state.darkTheme = !state.darkTheme
        },
        addAliasProfile(state, aliasData) {
            state.aliasFiles.push(aliasData)
        },
        removeAliasProfile(state, aliasId) {
            state.aliasFiles.splice(aliasId, 1);
        }
    }
}); */

const vueApp = new Vue({
    router,
    data: {
        aliasView: false,
        preferences: {
            darkTheme: false
        }
    },
    methods: {
        sideNavClose: () => {
            M.Sidenav.getInstance(document.querySelector(".sidenav")).close();
        },
        navigate: function(where) {
            router.go(where);
        }
    },
    created: function() {
        /**
         * Load User Data file (if found)
         */
        if (fs.existsSync(`${APP_DATA_PATH}/user-data.json`)) {
            fs.readFile(`${APP_DATA_PATH}/user-data.json`, (err, data) => {
                if (err) throw err;
    
                this.USER_DATA = JSON.parse(data);
            });
        } else {
            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(USER_DATA), (err) => {
                if (err) throw err;
            });
        }
    },
    watch: {
        "$route" (to) {
            if (to.path.match("alias-editor/alias")) {
                this.aliasView = true;
            } else {
                this.aliasView = false;
            }
        }
    }
}).$mount("#app");

M.AutoInit();

/***
 * Alias Profile
 */

function createAliasProfile() {
    // Validation
    let profileName = document.querySelector("#profile_name").value,
        aliasFilePath = document.querySelector("#alias_file_path").value;

    if (profileName.length > 0 && aliasFilePath.length > 0) {
        config.aliasFile.push({
            name: profileName,
            filePath: aliasFilePath
        });

        fs.writeFile(`${APP_DATA_PATH}/user-preference.json`, JSON.stringify(config), (err) => {
            if (err) throw err;
            reloadFiles();

            // Clear Form
            document.querySelector("#profile_name").value = "";
            document.querySelector("#alias_file_path").value = "";
        });
    }
}

function voiceServerListener(frequency) {
    rp("http://vhf.laartcc.org:18009/?opts=-R-D").then((html) => {
        const $ = cheerio.load(html);

        console.log($(`a:contains('${frequency}')`).text);
        /*$(`p:contains('${frequency}')`).next().text().split("\n").filter((data) => {
            if (data != "") return data;
        });*/
    });
}