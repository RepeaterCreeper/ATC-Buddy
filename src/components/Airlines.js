
const Airlines = {
    data: function() {
        return {
            results: [],
            favorites: USER_DATA["favorites"]["airlines"],
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
            this.results = Utils.showResults(val, AIRLINES);
        },
        favorites: function(val) {
            USER_DATA["favorites"]["airlines"] = val;

            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(USER_DATA), (err) => {
                if (err) throw err;
            });
        }
    },
    template: fs.readFileSync(path.join(__dirname, "./Airlines.html"), "utf-8")
};

module.exports = Airlines;