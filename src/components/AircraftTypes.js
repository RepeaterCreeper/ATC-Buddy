const AircraftTypes = {
    data: function() {
        return {
            results: [],
            favorites: [],
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
    template: fs.readFileSync(path.join(__dirname, "./AircraftTypes.html"), "utf-8"),
    watch: {
        inputText: function(val) {
            this.results = Utils.showResults(val, AIRCRAFT_TYPES)
        },
        favorites: function(val) {
            USER_DATA["favorites"]["aircraft_types"] = val;

            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(USER_DATA), (err) => {
                if (err) throw err;
            });
        }
    },
    created: function(){
        /**
         * Load User Data file (if found)
         */
        if (fs.existsSync(`${APP_DATA_PATH}/user-data.json`)) {
            USER_DATA = JSON.parse(fs.readFileSync(`${APP_DATA_PATH}/user-data.json`).toString());
            this.favorites = USER_DATA["favorites"]["aircraft_types"];
        } else {
            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(USER_DATA), (err) => {
                if (err) throw err;
            });
        }
    }
};

module.exports = AircraftTypes;