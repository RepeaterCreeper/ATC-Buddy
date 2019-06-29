const AircraftTypes = require(path.join(__dirname, "../components/AircraftTypes.js"));
const Airlines = require(path.join(__dirname, "../components/Airlines.js"));
const Airports = require(path.join(__dirname, "../components/Airports.js"));
const EquipmentSuffixes = require(path.join(__dirname, "../components/EquipmentSuffixes.js"));
const ScratchpadCodes = require(path.join(__dirname, "../components/ScratchpadCodes.js"));
const TECRoutes = require(path.join(__dirname, "../components/TECRoutes.js"));

/**
 * Alias Editor
 */
const AliasEditor = require(path.join(__dirname, "../components/AliasEditor.js"));
const EDITOR_home = require(path.join(__dirname, "../components/alias-editor/Home.js"));
const EDITOR_alias = require(path.join(__dirname, "../components/alias-editor/Alias.js"));

// Router Definition
const routes = [
    {
        path: "/aircraft-types",
        component: AircraftTypes
    },
    {
        path: "/airlines",
        component: Airlines
    },
    {
        path: "/airports",
        component: Airports
    },
    {
        path: "/equipment-suffixes",
        component: EquipmentSuffixes
    },
    {
        path: "/scratchpad-codes",
        component: ScratchpadCodes
    },
    {
        path: "/tec-routes",
        component: TECRoutes
    },
    {
        path: "/alias-editor",
        component: AliasEditor,
        children: [
            {
                path: "",
                component: EDITOR_home
            },
            {
                path: "alias/:id",
                props: true,
                component: EDITOR_alias
            }
        ]
    },
    {
        path: "*",
        redirect: "/aircraft-types"
    }
];


const router = new VueRouter({
    routes
});

module.exports = router;