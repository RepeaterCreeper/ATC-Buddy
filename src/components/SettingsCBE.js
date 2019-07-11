const CBETemplate = {
    borderType: "",
    profileName: "",
    coordinates: "",
    events: []
}

const SettingsCBE = {
    data: function() {
        return {
            cbeProfileModal: CBETemplate,
            cbe: USER_DATA['settings']['fsd']['coordinateBasedEvents']
        }
    },
    template: fs.readFileSync(path.join(__dirname, "./SettingsCBE.html"), "utf-8"),
    methods: {
        cbeProfile: function(id) {
            this.$router.push({"path": `/settings/cbe/${id}`})
        },
        newCBEProfile: function() {
            let CBEProfile = CBETemplate;

            CBEProfile.profileName = this.cbeProfileModal.profileName;

            
            const coordinates = this.cbeProfileModal.coordinates.split(" ");

            let latitudes = [],
                longitudes = [];
            
            for (let i = 0; i < coordinates.length; i += 2) {
                let coordinate = coordinates.slice(i, i + 2).map((data) => { return parseFloat(data); });

                latitudes.push(coordinate[0]);
                longitudes.push(coordinate[1]);
            }

            /**
             * Get the lon / lat min and max
             */
            let latMin = Math.min(...latitudes),
                latMax = Math.max(...latitudes),
                lonMin = Math.min(...longitudes),
                lonMax = Math.max(...longitudes);

            CBEProfile.coordinates = [];

            CBEProfile.coordinates[0] = [latMin, latMax];
            CBEProfile.coordinates[1] = [lonMin, lonMax];

            this.cbe.push(CBEProfile);

            let modal = document.querySelector("#newCBEProfile"),
                modalInstance = M.Modal.getInstance(modal);
            
            modalInstance.close();

            // Enter Validation here.  
            USER_DATA['settings']['fsd']['coordinateBasedEvents'] = this.cbe;

            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(USER_DATA), (err) => {
                if (err) throw err;
            });
        },
        viewCBEProfile: function(id) {
            this.$router.push({ 
                path: `/settings/cbe/${id}`,
                query: {
                    profileId: id,
                    profileData: this.cbe[id]
                }
            });
        },
        deleteCBEProfile: function(id){
            this.cbe.splice(id, 1);

            USER_DATA['settings']['fsd']['coordinateBasedEvents'] = this.cbe;

            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(USER_DATA), (err) => {
                if (err) throw err;
            });
        }
    },
    mounted: function(){
        M.AutoInit();
    }
}

module.exports = SettingsCBE;