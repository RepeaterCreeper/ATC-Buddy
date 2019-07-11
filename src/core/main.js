const fs = require("fs");
const { ipcRenderer, shell } = require("electron");
const { app } = require("electron").remote;
const path = require("path");
const rp = require("request-promise");
const cheerio = require("cheerio");
const Vue = require("vue/dist/vue.common");
const VueRouter = require("vue-router");
const net = require("net");

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

const AIRPORTS_LOCATIONS = require("./data/airports_location.json");

const VATSIM_SERVERS = [
    {
        "name": "CANADA",
        "ip": "69.42.61.44"
    },
    {
        "name": "GERMANY",
        "ip": "138.201.76.151"
    },
    {
        "name": "GERMANY2",
        "ip": "212.227.11.18"
    },
    {
        "name": "AUSTRALIA",
        "ip": "180.200.247.40"
    },
    {
        "name": "RUSSIA-C",
        "ip": "94.73.241.65"
    },
    {
        "name": "SINGAPORE",
        "ip": "128.199.91.34"
    },
    {
        "name": "SWEDEN",
        "ip": "176.124.148.55"
    },
    {
        "name": "UAE",
        "ip": "185.93.245.200"
    },
    {
        "name": "UK1",
        "ip": "178.79.154.95"
    },
    {
        "name": "USA-E",
        "ip": "97.107.135.245"
    },
    {
        "name": "USA-S",
        "ip": "69.42.49.158"
    },
    {
        "name": "USA-W",
        "ip": "50.116.3.203"
    }
];

const MEMES = [
    "https://www.youtube.com/watch?v=lhckuhUxcgA", // Laugh
    "https://www.youtube.com/watch?v=lXMskKTw3Bc", // Never gonna Give you up
    "https://www.youtube.com/watch?v=X2WH8mHJnhM" // My heart will go on flute
];

let USER_DATA = {
    "client": {
        "callsign": "",
        "cid": "",
        "name": ""
    },
    "settings": {
        "fsd": {
            "server": "",
            "squawkRange": [],
            "autocorrectAltitude": [],
            "autoAssignSquawk": [],
            "coordinateBasedEvents": []
        }
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

let USER_CUSTOM_DATA = {
    "aircraft_types": [],
    "airlines": [],
    "airports": [],
    "scratchpad_codes": [],
    "tec_routes": []
};

let FSD_DATA = {
    awaiting: {}
}

const APP_DATA_PATH = app.getPath("userData");

const router = require("./core/router.js");

const vueApp = new Vue({
    router,
    data: {
        requireBack: false,
        requireBackList: [
            "alias-editor/alias"
        ],
        sidenavFixed: false,
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
            if (document.querySelector(".sidenav-trigger").clientWidth > 0) {
                this.sidenavFixed = true;
                M.Sidenav.getInstance(document.querySelector(".sidenav")).close();
            } else {
                this.sidenavFixed = false;
            }
        },
        openAbout: function() {
            M.Modal.getInstance(document.querySelector("#aboutModal")).open();
            this.sideNavClose();
        },
        navigate: function(where) {
            router.go(where);
        }
    },
    watch: {
        "$route" (to) {
            if (to.path.match(new RegExp(/alias-editor\/alias/)) ||
                to.path.match(new RegExp(/settings\/cbe/))) {
                this.requireBack = true;
            } else {
                this.requireBack = false;
            }
        }
    },
    mounted: function(){
        Vue.set(this, "loading", false);
        M.AutoInit();
        ipcRenderer.send("atc-buddy", "ready");
    }
}).$mount("#app");

function voiceServerListener(frequency) {
    rp("http://vhf.laartcc.org:18009/?opts=-R-D").then((html) => {
        const $ = cheerio.load(html);

        console.log($(`a:contains('${frequency}')`).text);
        /*$(`p:contains('${frequency}')`).next().text().split("\n").filter((data) => {
            if (data != "") return data;
        });*/
    });
}

function saveCustomData(){
    fs.writeFile(`${APP_DATA_PATH}/user-custom-data.json`, JSON.stringify(USER_CUSTOM_DATA), (err) => {
        if (err) throw err;
    });
}

/**
 * ATCB Proxy Server
 */
function insideBoundary(lat, lon, boundingBox) {
    if (
        (lat >= boundingBox[0][0] && lat <= boundingBox[0][1]) &&
        (lon >= boundingBox[1][0] && lon <= boundingBox[1][1])
    ) {
        return true;
    }

    return false;
}

/**
 * Intercepts all data and processes it.
 * 
 * @param {*} data
 * @param {*} socket 
 */
function bindDataListener(data, socket) {
    data.forEach((data, index) => {
        if (data.length > 0) {
            if (data.charAt(0) != "@") { // Three letter PREFIX
                // $CQZLA_CE_OBS:SERVER:FP:DAL565
                data = data.split(":");

                switch (data[0].slice(0, 3)) {
                    case "$CQ":
                        let requestType = data[2];

                        switch (requestType) {
                            case "FP": // Aircraft has entered our scope
                                let callsign = data[data.length - 1];
                                FSD_DATA["awaiting"][callsign] = {
                                    generalInfo: {
                                        mode: "",
                                        scratchpad: "",
                                        squawk: 0
                                    },
                                    flightPlanData: []
                                };

                                // If auto assign is turned on, assign squawk to the aircraft that has just entered the scope.
                                if (USER_DATA['settings']['fsd']['autoAssignSquawk'] && FSD_DATA["awaiting"][callsign]["generalInfo"]["squawk"] == 0) {
                                    let squawk = Utils.generateSquawk();
                                    socket.write(`$CQ${USER_DATA['client']['callsign']}:@94835:BC:${callsign}:${squawk}`);
                                }
                            break;
                            case "SC": // Scratchpad
                                // Intercept the scratchpad for future use. <REQUIRED for now>
                                if (FSD_DATA["awaiting"][data[data.length - 2]]) {
                                    FSD_DATA["awaiting"][data[data.length - 2]]["generalInfo"]["scratchpad"] = data[data.length - 1];
                                }
                            break;
                            case "BC": // Squawk Assign
                                // $CQ<your_callsign>:@94835:BC:<ac_callsign>:<squawk>
                                if (FSD_DATA["awaiting"][data[data.length - 2]]) {
                                    FSD_DATA["awaiting"][data[data.length - 2]]["generalInfo"]["squawk"] = data[data.length - 1];
                                }
                            break;
                        }
                    break;
                    case "$FP":
                        if (Object.keys(FSD_DATA["awaiting"]).includes(data[0].slice(3))) {
                            FSD_DATA["awaiting"][data[0].slice(3)]["flightPlanData"] = data.slice(2);

                            if (USER_DATA['settings']['fsd']["autocorrectAltitude"]) {
                                let origin = data.slice(2)[3],
                                    dest = data.slice(2)[7],
                                    altitude = data.slice(2)[6];

                                let bearing = Utils.calculateBearing(AIRPORTS_LOCATIONS[origin].lat,
                                    AIRPORTS_LOCATIONS[origin].lon,
                                    AIRPORTS_LOCATIONS[dest].lat,
                                    AIRPORTS_LOCATIONS[dest].lon);
                                
                                if ((bearing > 0 && bearing < 180) && (altitude % 2 == 0)) { // ODD
                                    Utils.updateFP(data[0].slice(3), 6, parseInt(parseInt(altitude) + 1000), socket);
                                } else if ((bearing > 180 && bearing < 360) && (altitude % 2 != 0)){ // EVEN
                                    Utils.updateFP(data[0].slice(3), 6, parseInt(parseInt(altitude) + 1000), socket);
                                }
                            }
                        }
                    break;
                    case "#DP": // Pilot Disconnect
                        if (Object.keys(FSD_DATA["awaiting"]).includes(data[0].slice(3))) {
                            delete FSD_DATA["awaiting"][data[0].slice(3)];
                        }
                    break;
                }
            } else { // Two Letters prefix
                /**
                 * Handle Position Updates
                 */
                let [mode, callsign, squawk, rating, lat, lon, alt, groundspeed] = data.split(":");

                if (Object.keys(FSD_DATA['awaiting']).includes(callsign)) {
                    if (alt <= 1000) {
                        FSD_DATA["awaiting"][callsign]["generalInfo"]["mode"] = mode;

                        console.log(FSD_DATA["awaiting"][callsign]["generalInfo"]["squawk"] = squawk);
                        if (FSD_DATA["awaiting"][callsign]["generalInfo"]["squawk"] == 0) {
                            FSD_DATA["awaiting"][callsign]["generalInfo"]["squawk"] = squawk;
                        }
                    } else {
                        delete FSD_DATA["awaiting"][callsign];
                    }
                }

                USER_DATA["settings"]["fsd"]["coordinateBasedEvents"].forEach((cbe, index) => {
                    let coordinatePair1 = cbe["coordinates"][0],
                        coordinatePair2 = cbe["coordinates"][1]

                    if (insideBoundary(lat, lon, [coordinatePair1, coordinatePair2])) {
                        cbe["events"].forEach((item) => {
                            Utils.sendMessage(item, callsign, socket);
                        });
                    }
                });
            }
        }
    });
}

const proxyServer = net.createServer(function(ATCB){
    let loginPacketRetrieved = false;

    const VATSIM_SERVER = net.connect(6809, USER_DATA['settings']['fsd']['server'], function(err) {
        if (err) throw err;
    });

    VATSIM_SERVER.on("data", function(data) {
        ATCB.write(data);

        data = data.toString().split("\r\n");

        bindDataListener(data, ATCB);
    });

    ATCB.on("data", function(data) {
        VATSIM_SERVER.write(data);

        data = data.toString().split("\r\n");

        // This is the first packet that comes through.
        if (!loginPacketRetrieved) {
            let clientInformation = data[1].split(":");

            USER_DATA.client.callsign = clientInformation[0].slice(3);
            USER_DATA.client.cid = clientInformation[3];
            USER_DATA.client.name = clientInformation[2];

            loginPacketRetrieved = true;
        }

        bindDataListener(data, ATCB);
    });
});

proxyServer.listen(6809, (err) => {
    if (err) throw err;
});