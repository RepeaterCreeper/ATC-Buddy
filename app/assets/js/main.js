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
const AircraftTypes = { template: fs.readFileSync(path.resolve(__dirname) + "/views/AircraftTypes.html", "utf-8") };
const Airlines = { template: fs.readFileSync(path.resolve(__dirname) + "/views/Airlines.html", "utf-8") };
const Airports = { template: fs.readFileSync(path.resolve(__dirname) + "/views/Airports.html", "utf-8") };
const EquipmentSuffixes = { template: fs.readFileSync(path.resolve(__dirname) + "/views/EquipmentSuffixes.html", "utf-8") };
const ScratchpadCodes = { template: fs.readFileSync(path.resolve(__dirname) + "/views/ScratchpadCodes.html", "utf-8") };
const TECRoutes = {
    data: function() {
        return {
            results: []
        }
    },
    template: fs.readFileSync(path.resolve(__dirname) + "/views/TecRoutes.html", "utf-8"),
    methods: {
        changeData: function(key, value) {
            this.key = value;
        },
        getData: function(key) {
            return this.key
        },
        findTecRoute: function() {
            let departureAirport = document.querySelector("#tec_route_departure").value,
                arrivalAirport = document.querySelector("#tec_route_arrival").value;
            
            if (departureAirport.length > 3) departureAirport = departureAirport.slice(1);
            if (arrivalAirport.length > 3) arrivalAirport = arrivalAirport.slice(1);
        
            if (departureAirport.length > 0 && arrivalAirport.length > 0) {
                let results = INFO_TOOL_DATA["tec_routes"].filter((data) => {
                    if (data.departure.includes(departureAirport) && data.arrival.includes(arrivalAirport)) return data;
                });
                this.results = results;
            } else {
                let results = INFO_TOOL_DATA["tec_routes"].filter((data) => {
                    if (departureAirport.length > 0) {
                        if (data.departureAirport.includes(departureAirport)) return data;
                    } else {
                        if (data.arrivalAirport.includes(arrivalAirport)) return data;
                    }
                });
                this.results = results;
            }
        },
        /**
         * Turn TEC altitude to a more standard format
         * @param {string} unparsedAltitude 
         */
        formatAltitude(unparsedAltitude) {
            let altitudeMatch = new RegExp(/[JMPQ]+[0-9]+/g),
                tecAltitudes = unparsedAltitude.match(altitudeMatch),
                parsed = [];

            tecAltitudes.forEach((data) => {
                parsed.push(data);
            });

            return parsed.join(", ");
        }
    }
};

// Router Definition
const routes = [
    { path: "/aircraft-types", component: AircraftTypes},
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
        },
    }
}).$mount("#app");

M.AutoInit();

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