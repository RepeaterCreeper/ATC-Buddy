
const Airlines = {
    data: function() {
        return {
            results: [],
            favorites: USER_DATA["favorites"]["airlines"],
            entryPreview: {
                "name": "",
                "code": "",
                "callsign": ""
            },
            inputText: "",
            modalInstance: {}
        }
    },
    methods: {
        openModal: function(){
            this.modalInstance.open();
        },
        addFavorite: function(index) {
            this.favorites.push(this.results[index]);
        },
        removeFavorite: function(index) {
            this.favorites.splice(index, 1);
        },
        addEntry: function(){
            USER_CUSTOM_DATA["airlines"].push(this.entryPreview);
            
            saveCustomData();
            
            this.modalInstance.close();
        }
    },
    watch: {
        inputText: function(val) {
            this.results = Utils.showResults(val, AIRLINES, "airlines");
        },
        favorites: function(val) {
            USER_DATA["favorites"]["airlines"] = val;

            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(USER_DATA), (err) => {
                if (err) throw err;
            });
        }
    },
    mounted: function(){
        let modal = document.querySelector("#newAirlines"),
            instance = M.Modal.init(modal);

        this.modalInstance = instance;
    },
    template: fs.readFileSync(path.join(__dirname, "./Airlines.html"), "utf-8")
};

module.exports = Airlines;