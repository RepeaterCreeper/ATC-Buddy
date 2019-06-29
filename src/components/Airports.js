
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
            USER_CUSTOM_DATA["airports"].push(this.entryPreview);

            saveCustomData();

            this.modalInstance.close();
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