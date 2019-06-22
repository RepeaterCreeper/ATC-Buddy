const Utils = require(path.join(__dirname, "../core/utils.js"));
const ScratchpadCodes = {
    data: function() {
        return {
            results: [],
            inputText: ""
        }
    },
    watch: {
        inputText: function(val) {
            this.results = Utils.showResults(val, "scratchpad_codes");
        }
    },
    template: fs.readFileSync(path.join(__dirname, "./ScratchpadCodes.html"), "utf-8")
};

module.exports = ScratchpadCodes;