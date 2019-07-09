const AircraftTypes = {
    data: function() {
        return {
            results: [],
            favorites: [],
            entryPreview: {
                "manufacturer": "",
                "model": "",
                "code": "",
                "weight_class": "",
                "tec_class": ""
            }, // Generate Base for entry Preview
            inputText: "",
            modalInstance: {}
        }
    },
    methods: {
        addFavorite: function(index) {
            this.favorites.push(this.results[index]);
        },
        removeFavorite: function(index) {
            this.favorites.splice(index, 1);
        },
        addEntry: function() {
            if (!Object.values(this.entryPreview).includes("")) {
                USER_CUSTOM_DATA["aircraft_types"].push(this.entryPreview);

                saveCustomData();

                this.modalInstance.close();

                if (Object.values(this.entryPreview).includes(this.inputText)) {
                    this.results.push(this.entryPreview);
                }
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
    template: fs.readFileSync(path.join(__dirname, "./AircraftTypes.html"), "utf-8"),
    watch: {
        inputText: function(val) {
            this.results = Utils.showResults(val, AIRCRAFT_TYPES, "aircraft_types");
        },
        favorites: function(val) {
            USER_DATA["favorites"]["aircraft_types"] = val;

            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(USER_DATA), (err) => {
                if (err) throw err;
            });

            this.results = Utils.showResults(this.inputText, AIRCRAFT_TYPES, "aircraft_types");

        }
    },
    mounted: function(){
        let acTypeEntryModal = document.querySelector("#newEntry"),
            acTypeEntryInstance = M.Modal.init(acTypeEntryModal);
        
        this.modalInstance = acTypeEntryInstance;
    },
    created: function(){
        /**
         * Load User Data file (if found)
         */
        if (fs.existsSync(`${APP_DATA_PATH}/user-data.json`)) {
            USER_DATA = JSON.parse(fs.readFileSync(`${APP_DATA_PATH}/user-data.json`).toString());
        } else {
            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(USER_DATA), (err) => {
                if (err) throw err;
            });
        }

        if (fs.existsSync(`${APP_DATA_PATH}/user-custom-data.json`)) {
            USER_CUSTOM_DATA = JSON.parse(fs.readFileSync(`${APP_DATA_PATH}/user-custom-data.json`).toString());
        
            this.favorites = USER_DATA["favorites"]["aircraft_types"];
        } else {
            fs.writeFile(`${APP_DATA_PATH}/user-custom-data.json`, JSON.stringify(USER_CUSTOM_DATA), (err) => {
                if (err) throw err;
            });
        }

        // Generate Base for entry preview
        /*Object.keys(AIRCRAFT_TYPES[0]).forEach((key) => {
            this.entryPreview[key] = ""
        });*/
    }
};

module.exports = AircraftTypes;