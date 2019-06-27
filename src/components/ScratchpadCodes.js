
const ScratchpadCodes = {
    data: function() {
        return {
            results: [],
            favorites: USER_DATA["favorites"]["scratchpad_codes"],
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
            this.results = Utils.showResults(val, SCRATCHPAD_CODES);
        },
        favorites: function(val) {
            USER_DATA["favorites"]["scratchpad_codes"] = val

            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(USER_DATA), (err) => {
                if (err) throw err;
            });
        }
    },
    template: fs.readFileSync(path.join(__dirname, "./ScratchpadCodes.html"), "utf-8")
};

module.exports = ScratchpadCodes;