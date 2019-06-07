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



async function loadEditor(id) {
    const buf = (async function() {
        try {
            await fs.readFile(config.aliasFile[id].filePath)
        } catch (err) {
            throw err;
        }
    });
    const content = buf.toString();
    console.log(content);

    /* fs.readFile(config.aliasFile[id].filePath, "utf-8", (err, data) => {
        if (err) throw err;

        let commandsListContainer = document.querySelector("#commandsList"),
            commandGroupCount = 0;

        commandsListContainer.innerHTML = "";


        let containerList = ["collection", "command-group-container"];

        let commandGroupContainer = document.querySelectorAll(".command-group-container")[commandGroupCount];

        data.split("\n").forEach((line) => {
            if (line.substring(0, 1) == ".") {
                let li = document.createElement("li"),
                    kbd = document.createElement("kbd");

                let aliasCommand = line.substring(1).split(" ")[0],
                    command = line.substring(1).split(" ").slice(1).join(" ");

                kbd.innerHTML = aliasCommand;
                li.innerHTML += kbd.outerHTML + " " + command;

                li.classList.add("collection-item");

                if (commandGroupContainer) {
                    commandGroupContainer.append(li);
                } else if (commandGroupCount == 0) {
                    let ul = document.createElement("ul")
                    ul.classList.add(...containerList);
                    ul.setAttribute("data-command-group", commandGroupCount);

                    commandsListContainer.append(ul);

                    commandGroupContainer = document.querySelectorAll(".command-group-container")[commandGroupCount];
                    commandGroupContainer.append(li);
                }
            } else if (line.substring(0, 1) == "#") {
                let ul = document.createElement("ul"),
                    header = document.createElement("h5");

                ul.classList.add(...containerList);
                header.innerHTML = line.substring(1);
                header.style.fontWeight = "lighter";

                commandsListContainer.append(header);
                commandsListContainer.append(ul);

                commandGroupCount += 1;
                commandGroupContainer = document.querySelectorAll(".command-group-container")[commandGroupCount - 1];
            }
        })
    }); */
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
/**
 * General
 */
/* document.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-alias-id") && event.target.hasAttribute("data-alias-action")) {
        let action = event.target.getAttribute("data-alias-action"),
            id = event.target.getAttribute("data-alias-id");

        switch (action) {
            case "edit": //Edit
                document.querySelector("section[data-section='menu_alias_editor']").classList.toggle("hide");
                document.querySelector("section[data-section='main_alias_editor']").classList.toggle("hide");

                document.querySelector("#menu_trigger").classList.toggle("hide")
                document.querySelector("#editor_back_trigger").classList.toggle("hide")
                loadEditor(id);
                break;
            case "delete": //Delete
                config.aliasFile.splice(id, 1);
                modifiedConfig();
                break;
        }
    }
}); */

// Attach for alias Back
/*let actionButtons = document.querySelector("a[data-action]");

actionButtons.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    switch (e.path[1].getAttribute("data-action")) {
        case "aliasEditorBack":
            document.querySelector("section[data-section='menu_alias_editor']").classList.toggle("hide");
            document.querySelector("section[data-section='main_alias_editor']").classList.toggle("hide");

            document.querySelector("#menu_trigger").classList.toggle("hide")
            document.querySelector("#editor_back_trigger").classList.toggle("hide")
            break;
    }
})

function init() {
    // Check if a user-data file has been created already.
    if (fs.existsSync(`${APP_DATA_PATH}/user-preference.json`)) {
        fs.readFile(`${APP_DATA_PATH}/user-preference.json`, (err, data) => {
            if (err) throw err;

            let appData = JSON.parse(data);
            config = appData;

            reloadFiles()
        });
    } else {
        fs.writeFile(`${APP_DATA_PATH}/user-preference.json`, JSON.stringify(config), (err) => {
            if (err) throw err;
        });
    }
}

// temporary remeedy - will change in future version
function modifiedConfig() {
    fs.writeFile(`${APP_DATA_PATH}/user-preference.json`, JSON.stringify(config), (err) => {
        if (err) throw err;
        reloadFiles();
    })
}

function reloadFiles() {
    document.querySelector("#alias_profiles").innerHTML = "";

    // Display Alias Profiles
    config.aliasFile.forEach((aliasFile, index) => {
        let aliasProfilesContainer = document.querySelector("#alias_profiles");

        let div = document.createElement("div");

        div.innerHTML = `
            <div class="card-content row">
                <div class="col s10">
                    <b>${aliasFile.name}</b><br>
                    <small>${aliasFile.filePath}</small>
                </div>
                <div class="col s2" style="height: 42px; display: flex; align-items: center; justify-content: space-evenly;">
                    <i class="no-select material-icons small">error_outline</i>
                    <i class="no-select material-icons small aliasMenu_button" data-position="top" data-tooltip="Edit" data-alias-id='${index}' data-alias-action="edit">edit</i>
                    <i class="no-select material-icons small aliasMenu_button" data-position="top" data-tooltip="Delete" data-alias-id='${index}' data-alias-action="delete">close</i>
                </div>
            </div>
        `;
        div.classList.add("card", "hoverable");
        aliasProfilesContainer.append(div);
    });
}*/