
const ScratchpadCodes = {
    data: function() {
        return {
            results: [],
            entryPreview: {
                "icao": "",
                "procedure": "",
                "transition": "",
                "scratch": ""  
            },
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
        },
        addEntry: function(){
            if (!Object.values(this.entryPreview).includes("")) {
                USER_CUSTOM_DATA["scratchpad_codes"].push(this.entryPreview);

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
            this.results = Utils.showResults(val, SCRATCHPAD_CODES, "scratchpad_codes");
        },
        favorites: function(val) {
            USER_DATA["favorites"]["scratchpad_codes"] = val

            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(USER_DATA), (err) => {
                if (err) throw err;
            });

            this.results = Utils.showResults(this.inputText, SCRATCHPAD_CODES, "scratchpad_codes");
        }
    },
    mounted: function(){
        let modalElement = document.querySelector("#newEntry"),
            modalInstance = M.Modal.init(modalElement);

        this.modalInstance = modalInstance;
    },
    template: fs.readFileSync(path.join(__dirname, "./ScratchpadCodes.html"), "utf-8")
};

module.exports = ScratchpadCodes;