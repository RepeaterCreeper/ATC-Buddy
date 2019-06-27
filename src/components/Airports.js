
const Airports = {
    data: function() {
        return {
            results: [],
            favorites: USER_DATA["favorites"]["airports"],
            inputText: ""
        }
    },
    methods: {
        addFavorite: function(index) {
            this.favorites.push(this.results[index]);
        },
        removeFavorite: function(index) {
            this.favorites.splice(index, 1);
        }
    },
    watch: {
        inputText: function(val) {
            this.results = Utils.showResults(val, AIRPORTS);
        },
        type: function(val) {
            this.type = val;
            this.typeName = val == false ? "general" : "icao"
        },
        favorites: function(val) {
            USER_DATA["favorites"]["airports"] = val;

            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(USER_DATA), (err) => {
                if (err) throw err;
            });
        }
    },
    template: fs.readFileSync(path.join(__dirname, "./Airports.html"), "utf-8")
};

module.exports = Airports;