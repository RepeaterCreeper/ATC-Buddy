const Utils = require(path.join(__dirname, "../core/utils.js"));
const Airports = {
    data: function() {
        return {
            results: [],
            inputText: ""
        }
    },
    watch: {
        inputText: function(val) {
            this.results = Utils.showResults(val, "airports");
        },
        type: function(val) {
            this.type = val;
            this.typeName = val == false ? "general" : "icao"
        }
    },
    template: fs.readFileSync(path.join(__dirname, "./Airports.html"), "utf-8")
};

module.exports = Airports;