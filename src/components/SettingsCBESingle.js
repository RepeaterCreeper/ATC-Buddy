const SettingsCBESingle = {
    data() {
        return {
            cbeEventModal: {
                title: "",
                receiver: "",
                content: ""
            },
            profileId: this.$route.query.profileId,
            profileData: this.$route.query.profileData,
            parentCBE: USER_DATA["settings"]["fsd"]["coordinateBasedEvents"][this.$route.query.profileId],
            modalInstance: ""
        }
    },
    methods: {
        newCBEEvent: function(){
            let content = Utils.buildData("textMessage", {
                "receiver": this.cbeEventModal.receiver,
                "content": this.cbeEventModal.content
            });
            
            this.parentCBE["events"].push({
                title: this.cbeEventModal.title,
                content: content
            });

            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(USER_DATA), (err) => {
                if (err) throw err;
            })
        },
        deleteCBEEvent: function(id) {
            this.parentCBE["events"].splice(id, 1);

            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(USER_DATA), (err) => {
                if (err) throw err;
            })
        }
    },
    mounted: function(){
        let modal = document.querySelector("#newEventModal"),
            modalInstance = M.Modal.init(modal);
        
        this.modalInstance = modalInstance;
    },
    template: fs.readFileSync(path.join(__dirname, "./SettingsCBESingle.html"), "utf-8")
}

module.exports = SettingsCBESingle;