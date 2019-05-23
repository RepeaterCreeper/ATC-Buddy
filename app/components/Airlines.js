const Utils = require(path.join(__dirname, "../assets/js/utils.js"));
const Airlines = {
    data: function() {
        return {
            results: [],
            inputText: ""
        }
    },
    watch: {
        inputText: function(val) {
            this.results = Utils.showResults(val, "airlines");
        }
    },
    template: fs.readFileSync(path.join(__dirname, "../templates/Airlines.html"), "utf-8")
};

module.exports = Airlines;