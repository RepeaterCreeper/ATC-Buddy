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
        }
    },
    template: fs.readFileSync(path.join(__dirname, "./Airports.html"), "utf-8")
};

module.exports = Airports;