const EquipmentSuffixes = {
    template: fs.readFileSync(path.join(__dirname, "../templates/EquipmentSuffixes.html"), "utf-8")
};

module.exports = EquipmentSuffixes;