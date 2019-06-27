const fs = require("fs");
const { ipcRenderer } = require("electron");
const { app } = require("electron").remote;
const path = require("path");
const rp = require("request-promise");
const cheerio = require("cheerio");
const Vue = require("vue/dist/vue.common");
const VueRouter = require("vue-router");

const Utils = require(path.join(__dirname, "/core/utils.js"));

Vue.use(VueRouter);

/**
 * Setup
 */
const AIRCRAFT_TYPES = require("./data/aircraft_types.json");
const AIRLINES = require("./data/airlines.json");
const AIRPORTS = require("./data/airports.json");
const EQUIPMENT_SUFFIXES = require("./data/equipment_suffixes.json");
const SCRATCHPAD_CODES = require("./data/scratchpad_codes.json");
const TEC_ROUTES = require("./data/tec_routes.json");

const APP_DATA_PATH = app.getPath("userData");

const router = require("./core/router.js");

const vueApp = new Vue({
    router,
    data: {
        aliasView: false,
        preferences: {
            darkTheme: false
        },
        loading: true
    },
    methods: {
        sideNavClose: () => {
            M.Sidenav.getInstance(document.querySelector(".sidenav")).close();
        },
        openAbout: function() {
            document.querySelector("#aboutModal").M_Modal.open();
            this.sideNavClose();
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
    },
    mounted: function(){
        Vue.set(this, "loading", false);
        ipcRenderer.send("atc-buddy", "ready");

        /* this.$nextTick(function(){
            this.loading = false;
        }); */
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