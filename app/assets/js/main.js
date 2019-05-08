const rp = require("request-promise");
const fs = require("fs");
const cheerio = require("cheerio");
const { dialog, app } = require("electron").remote;

/**
 * ZLA Info Tool
 */

const INFO_TOOL_DATA = require("./assets/data/data");
const APP_DATA_PATH = app.getPath("userData");

let config = {"user-preference": {},"aliasFile": []}

let sessionData;

if (!sessionStorage.getItem("data")) {
    sessionStorage.setItem("data", JSON.stringify({
        "sectionActive": "aircraft_types"
    }));

    sessionData = JSON.parse(sessionStorage.getItem("data"));
} else {
    sessionData = JSON.parse(sessionStorage.getItem("data"));
}

// Initialize App
M.AutoInit();
init();

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
}

function switchSections(id) {
    let specifiedSection = document.querySelector(`section[data-section='${id}']`),
        sectionNavButton = document.querySelector(`a[data-section-target='${id}']`).parentElement;

    if (specifiedSection.className == "hide") {
        specifiedSection.classList.toggle("hide");
        sectionNavButton.classList.toggle("active");

        document.querySelector(`section[data-section='${sessionData.sectionActive}']`).classList.toggle("hide");
        document.querySelector(`a[data-section-target='${sessionData.sectionActive}']`).parentElement.classList.toggle("active");

        sessionData.sectionActive = id;

        /**
         * Simple check if sidenavTrigger is visible and if it is visible we can
         * assume that they're in desktop view meaning sidenav is supposed to be
         * fixed. Hence why we don't need to close the sidenav when they press a
         * nav-item.
         */
        let sidenavTrigger = document.querySelector(".sidenav-trigger");
        if (sidenavTrigger.offsetWidth > 0 || sidenavTrigger.offsetHeight > 0) {            
            M.Sidenav.getInstance(document.querySelector(".sidenav")).close();
        }
    }
}

function formatAltitude(unparsedAltitude) {
    let altitudeMatch = new RegExp(/[JMPQ]+[0-9]+/g),
        tecAltitudes = unparsedAltitude.match(altitudeMatch),
        parsed = [];

    tecAltitudes.forEach((data) => {
        parsed.push(data);
    });

    return parsed.join(", ");
}

function findTecRoute(departure, arrival) {
    let DEPARTURE = departure !== undefined ? departure : document.querySelector("#tec_route_departure").value,
        ARRIVAL = arrival !== undefined ? arrival : document.querySelector("#tec_route_arrival").value;
    
    let results = [];

    if (DEPARTURE.length > 3) DEPARTURE = DEPARTURE.slice(1);
    if (ARRIVAL.length > 3) ARRIVAL = ARRIVAL.slice(1);

    if (DEPARTURE.length > 0 && ARRIVAL.length > 0) {
        results = INFO_TOOL_DATA["tec_routes"].filter((data) => {
            if (data.departure.includes(DEPARTURE) && data.arrival.includes(ARRIVAL)) return data;
        });
    } else {
        results = INFO_TOOL_DATA["tec_routes"].filter((data) => {
            if (DEPARTURE.length > 0) {
                if (data.departure.includes(DEPARTURE)) return data;
            } else {
                if (data.arrival.includes(ARRIVAL)) return data;
            }
        });
    }

    /**
     * Display Results
     **/
    let container_target = document.querySelector(`div[data-result-type='tec_routes']`);
    container_target.innerHTML = ``;

    results.forEach((result) => {
        let div = document.createElement("div");

        div.innerHTML = `
            <div class="card-header white-text">
                <b class="tecroute__title">${result.name}</b>
                <p class="tecroute__altitudes" style="margin: 0;">${formatAltitude(result.altitudes)}</p>
            </div>
            <div class="card-content">
                <p class="tecroute__route">${result.route}</p>
            </div>
            <div class="card-footer">
                <span class="tecroute__note" style="margin: 8px;">${result.notes}</span>
                <button class="btn blue tecroute__copy waves-effect waves-red" style="height: 48px;">
                    <i class="material-icons">content_paste</i>
                </button>
            </div>
        `;
        div.classList.add("card", "hoverable", "tecroute__card");
        container_target.append(div);
    });
}


function showResults(queryString, type) {
    let container_target = document.querySelector(`ul[data-result-type=${type}]`);

    queryString = queryString.toLowerCase();
    container_target.innerHTML = "";

    if (queryString.length >= 1) {
        let results = INFO_TOOL_DATA[type].filter((data) => {
            if (Object.values(data).join(" ").toLowerCase().includes(queryString)) return data;
        });

        if (results.length) {
            if (results.length < 100) {
                results.forEach((result) => {
                    let li = document.createElement("li");
                    switch (type) {
                        case "aircraft_types":
                            li.innerHTML = `
                                <div class="row" style="margin-bottom: 0; display: flex; overflow-y: hidden;">
                                    <div class="col s8" style="height: 42px;">
                                        <b>${result.manufacturer}</b><br>
                                        <p style="margin: 0">${result.model}</p>
                                    </div>
                                    <div class="col s2" style="display: table; height: 42px;">
                                        <span style="vertical-align: middle; display: table-cell;">${result.code}</span>
                                    </div>
                                    <div class="col s1" style="display: table; height: 42px;">
                                        <span style="vertical-align: middle; display: table-cell;">${result.tec_class}</span>
                                    </div>
                                    <div class="col s1" style="display: table; height: 42px;">
                                        <span style="vertical-align: middle; display: table-cell;">${result.weight_class}</span>
                                    </div>
                                </div>
                            `;
                            break;
                        case "airlines":
                            li.innerHTML = `
                                <div class="row" style="margin-bottom: 0;">
                                    <div class="col s1" style="display: table; height: 42px;">
                                        <span style="vertical-align: middle; display: table-cell;">${result.code}</span>
                                    </div>
                                    <div class="col s3" style="display: table; height: 42px;">
                                        <span style="vertical-align: middle; display: table-cell;">${result.callsign}</span>
                                    </div>
                                    <div class="col s8" style="height: 42px; display: table;">
                                        <b style="vertical-align: middle; display: table-cell;">${result.name}</b>
                                    </div>
                                </div>
                            `;
                            break;
                        case "airports":
                            li.innerHTML = `
                                <div class="row" style="margin-bottom: 0;">
                                    <div class="col s1" style="height: 42px; display: table;">
                                        <b style="vertical-align: middle;display: table-cell;">${result.icao}</b>
                                    </div>
                                    <div class="col s9">
                                        <b>${result.name}</b>
                                        <p style="margin: 0;">${result.city}, ${result.country}</p>
                                    </div>
                                </div>
                            `;
                            break;
                        case "scratchpad_codes":
                            li.innerHTML = `
                                <div class="row" style="margin-bottom: 0;">
                                    <div class="col s1" style="height: 42px; display: table; border-right: 1px solid #ffc8c89e;">
                                        <b style="vertical-align: middle; display: table-cell">${result.icao}</b>
                                    </div>
                                    <div class="col s3" style="height: 42px; display: table; ">
                                        <span style="vertical-align: middle; display: table-cell">${result.procedure}</span>
                                    </div>
                                    <div class="col s3" style="height: 42px; display: table;">
                                        <span style="vertical-align: middle; display: table-cell">${result.transition}</span>
                                    </div>
                                    <div class="col s5" style="height: 42px; display: table; text-align: right;">
                                        <span style="vertical-align: middle; display: table-cell">${result.scratch}</span>
                                    </div>
                                </div>
                            `;
                        
                    }
                    li.className = "collection-item";

                    container_target.append(li);
                });
            }
        }
    }
}

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

function loadAliasFile(){
    dialog.showOpenDialog({
        title: "Alias File...",
        filters: [
            { name: "Alias File", extensions: ["txt"] }
        ]
    }, (filePaths) => {
        document.querySelector("#alias_file_path").value = filePaths[0];
    });
}

function loadEditor(id) {
    fs.readFile(config.aliasFile[id].filePath, "utf-8", (err, data) => {
        if (err) throw err;

        let commandsListContainer = document.querySelector("#commands-list-item__container");
        commandsListContainer.innerHTML = "";

        data.split("\n").forEach((line) => {
            if (line.substring(0, 1) == ".") {
                let li = document.createElement("li");
                li.innerHTML = line.substring(1);

                li.classList.add("collection-item");

                commandsListContainer.append(li);
            }
        })
    });
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
document.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-section-target")) {
        switchSections(event.target.getAttribute("data-section-target"));
    } else if (event.target.hasAttribute("data-alias-id") && event.target.hasAttribute("data-alias-action")) {
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
});

// Attach for alias Back
let actionButtons = document.querySelector("a[data-action]");

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