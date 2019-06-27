const fs = require("fs");
const { ipcRenderer, shell } = require("electron");
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

const MEMES = [
    "https://www.youtube.com/watch?v=lhckuhUxcgA", // Laugh
    "https://www.youtube.com/watch?v=lXMskKTw3Bc", // Never gonna Give you up
    "https://www.youtube.com/watch?v=X2WH8mHJnhM" // My heart will go on flute
];

let USER_DATA = {
    "preferences": {
        "darkTheme": false
    },
    "aliasFiles": [],
    "favorites": {
        "aircraft_types": [],
        "airlines": [],
        "airports": [],
        "scratchpad_codes": [],
        "tec_routes": []
    }
};

const APP_DATA_PATH = app.getPath("userData");

const router = require("./core/router.js");

const vueApp = new Vue({
    router,
    data: {
        aliasView: false,
        loading: true
    },
    methods: {
        meme: function(){
            shell.openExternal(MEMES[(Math.random() * 2).toFixed(0)]);
        },
        openLink: function(url){
            shell.openExternal(url);
        },
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