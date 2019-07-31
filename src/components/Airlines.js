/**
 * This file contains all Airlines specific data and methods.
 */
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
            /**
             * Check if the entryPreview object contains any empty strings ("")
             * If it does, trigger the adding of invalid class for EACH of the element
             * that is empty.
             */
            if (!Object.values(this.entryPreview).includes("")) {
                USER_CUSTOM_DATA["airlines"].push(this.entryPreview);
                saveCustomData();

                this.modalInstance.close();
                
                /**
                 * If the current search query is about the added data, push it in the result stack
                 * this way the user will be able to see it IMMEDIATLY after creating it.
                 */
                if (Object.values(this.entryPreview).includes(this.inputText)) {
                    this.results.push(this.entryPreview);
                }
            } else {
                /**
                 * Adds invalid class for if the user enters nothing for the 'New Entry' Modal.
                 */
                for (const key in this.entryPreview) { // Goes through every key entryPreview item
                    if (this.entryPreview[key].length == 0) { // If the length is 0 trigger the adding of "invalid" class to this specific element;
                        document.querySelector(`#newEntry__${key}`).classList.add("invalid");
                    }
                }
            }
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

            this.results = Utils.showResults(this.inputText, AIRLINES, "airlines");

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