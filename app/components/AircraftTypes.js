const Utils = require(path.join(__dirname, "../assets/js/utils.js"));

const AircraftTypes = {
    data: function() {
        return {
            results: [],
            inputText: ""
        }
    },
    template: fs.readFileSync(path.join(__dirname, "../templates/AircraftTypes.html"), "utf-8"),
    watch: {
        inputText: function(val) {
            this.results = Utils.showResults(val, "aircraft_types");
        }
    }
};

module.exports = AircraftTypes;