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
const AircraftTypes = require(path.join(__dirname, "/components/AircraftTypes.js"));
const Airlines = require(path.join(__dirname, "/components/Airlines.js"));
const Airports = require(path.join(__dirname, "/components/Airports.js"));
const EquipmentSuffixes = require(path.join(__dirname, "/components/EquipmentSuffixes.js"));
const ScratchpadCodes = require(path.join(__dirname, "/components/ScratchpadCodes.js"));
const TECRoutes = require(path.join(__dirname, "/components/TECRoutes.js"));

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

function voiceServerListener(frequency) {
    rp("http://vhf.laartcc.org:18009/?opts=-R-D").then((html) => {
        const $ = cheerio.load(html);

        console.log($(`a:contains('${frequency}')`).text());
        /*$(`p:contains('${frequency}')`).next().text().split("\n").filter((data) => {
            if (data != "") return data;
        });*/
    });
}