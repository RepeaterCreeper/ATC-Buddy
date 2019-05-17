const fs = require("fs");
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

// Router Pages
const AircraftTypes = { template: fs.readFileSync(path.resolve(__dirname) + "/views/AircraftTypes.vue", "utf-8") };
const Airlines = { template: fs.readFileSync(path.resolve(__dirname) + "/views/Airlines.vue", "utf-8") };
const Airports = { template: fs.readFileSync(path.resolve(__dirname) + "/views/Airports.vue", "utf-8") };
const EquipmentSuffixes = { template: fs.readFileSync(path.resolve(__dirname) + "/views/EquipmentSuffixes.vue", "utf-8") };
const ScratchpadCodes = { template: fs.readFileSync(path.resolve(__dirname) + "/views/ScratchpadCodes.vue", "utf-8") };
const TECRoutes = { template: fs.readFileSync(path.resolve(__dirname) + "/views/TecRoutes.vue", "utf-8") };

// Router Definition
const routes = [
    { path: "/aircraft-types", component: AircraftTypes },
    { path: "/airlines", component: Airlines },
    { path: "/airports", component: Airports },
    { path: "/equipment-suffixes", component: EquipmentSuffixes },
    { path: "/scratchpad-codes", component: ScratchpadCodes },
    { path: "/tec-routes", component: TECRoutes },
    { path: "*", redirect: "/aircraft-types"}
];

const router = new VueRouter({
    routes
});

const app = new Vue({
    router,
    methods: {
        sideNavClose: () => {
            M.Sidenav.getInstance(document.querySelector(".sidenav")).close();
        }
    }
}).$mount("#app");

M.AutoInit();

/**
 * Turn TEC altitude to a more standard format
 * @param {string} unparsedAltitude 
 */
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
     * 
     */
    
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

function voiceServerListener(frequency) {
    rp("http://vhf.laartcc.org:18009/?opts=-R-D").then((html) => {
        const $ = cheerio.load(html);

        console.log($(`a:contains('${frequency}')`).text());
        /*$(`p:contains('${frequency}')`).next().text().split("\n").filter((data) => {
            if (data != "") return data;
        });*/
    });
}