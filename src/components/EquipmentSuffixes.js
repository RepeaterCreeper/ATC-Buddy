const EquipmentSuffixes = {
    template: fs.readFileSync(path.join(__dirname, "./EquipmentSuffixes.html"), "utf-8")
};

module.exports = EquipmentSuffixes;