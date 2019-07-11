const Settings = {
    template: fs.readFileSync(path.join(__dirname, "./Settings.html"), "utf-8")
};

module.exports = Settings;