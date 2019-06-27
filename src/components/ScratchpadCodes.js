
const ScratchpadCodes = {
    data: function() {
        return {
            results: [],
            inputText: ""
        }
    },
    watch: {
        inputText: function(val) {
            this.results = Utils.showResults(val, SCRATCHPAD_CODES);
        }
    },
    template: fs.readFileSync(path.join(__dirname, "./ScratchpadCodes.html"), "utf-8")
};

module.exports = ScratchpadCodes;