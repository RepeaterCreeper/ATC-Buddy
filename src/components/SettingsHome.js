const SettingsItem = require("./SettingsItem.js");

const SettingsHome = {
    data: function(){
        return {
            options: {
                server: USER_DATA['settings']['fsd']['server'],
                autocorrectAltitude: USER_DATA['settings']['fsd']['autocorrectAltitude'],
                autoAssignSquawk: USER_DATA['settings']['fsd']['autoAssignSquawk'],
                squawkRange: USER_DATA['settings']['fsd']['squawkRange'],
                coordinateBasedEvents: USER_DATA['settings']['fsd']['coordinateBasedEvents']
            },
            servers: VATSIM_SERVERS
        }
    },
    methods: {
        navigateToCBE: function(){
            this.$router.push({ path: '/settings/cbe' })
        },
        handleChange: function(event) {
            let element = event.target,
                elementName = event.target.name;

            if (element.type == "checkbox") {
                this.options[elementName] = element.checked;
            } else if (element.type == "number") {
                if (elementName == "squawkMin") this.options.squawkRange[0] = element.value;
                if (elementName == "squawkMax") this.options.squawkRange[1] = element.value;
            } else if (element.type == "select-one") {
                this.options.server = element.value;
            }
            USER_DATA['settings']['fsd'] = this.options;

            fs.writeFile(`${APP_DATA_PATH}/user-data.json`, JSON.stringify(USER_DATA), (err) => {
                if (err) throw err;
            });
        }
    },
    template: fs.readFileSync(path.join(__dirname, "./SettingsHome.html"), "utf-8"),
    components: {
        "settings-item": SettingsItem
    },
    mounted: function(){
        this.$nextTick(function(){
            M.AutoInit();
        });
    }
}

module.exports = SettingsHome;