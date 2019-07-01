
const Airports = {
    data: function() {
        return {
            results: [],
            favorites: USER_DATA["favorites"]["airports"],
            entryPreview: {
                "icao": "",
                "name": "",
                "city": "",
                "country": ""
            },
            inputText: ""
        }
    },
    methods: {
        addFavorite: function(index) {
            this.favorites.push(this.results[index]);
        },
        removeFavorite: function(index) {
            this.favorites.splice(index, 1);
        },
        addEntry: function(){
            if (!Object.values(this.entryPreview).includes("")) {
                USER_CUSTOM_DATA["airports"].push(this.entryPreview);

                saveCustomData();

                this.modalInstance.close();

                // Push it right away to the results so that it can be shown.
                this.results.push(this.entryPreview);
            } else {
                for (const key in this.entryPreview) {
                    if (this.entryPreview[key].length == 0) {
                        document.querySelector(`#newEntry__${key}`).classList.add("invalid");
                    }
                }
            }
        },
        openModal: function(){
            this.modalInstance.open();
        }
    },
    watch: {
        inputText: function(val) {
            this.results = Utils.showResults(val, AIRPORTS, "airports");
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

            this.results = Utils.showResults(this.inputText, AIRPORTS, "airports");
        }
    },
    mounted: function(){
        let modalElement = document.querySelector("#newEntry"),
            modalInstance = M.Modal.init(modalElement);

        this.modalInstance = modalInstance;
    },
    template: fs.readFileSync(path.join(__dirname, "./Airports.html"), "utf-8")
};

module.exports = Airports;