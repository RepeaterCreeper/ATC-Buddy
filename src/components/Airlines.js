
const Airlines = {
    data: function() {
        return {
            results: [],
            inputText: ""
        }
    },
    watch: {
        inputText: function(val) {
            this.results = Utils.showResults(val, AIRLINES);
        }
    },
    template: fs.readFileSync(path.join(__dirname, "./Airlines.html"), "utf-8")
};

module.exports = Airlines;