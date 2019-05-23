const Utils = require(path.join(__dirname, "../assets/js/utils.js"));
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
    template: fs.readFileSync(path.join(__dirname, "../templates/Airports.html"), "utf-8")
};

module.exports = Airports;