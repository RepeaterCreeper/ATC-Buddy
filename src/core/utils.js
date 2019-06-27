const { clipboard } = require("electron");

module.exports.showResults = (queryString, typeContainer) => {
    queryString = queryString.toLowerCase();

    if (queryString.length >= 1) {
        let results = typeContainer.filter((data) => {
            if (Object.values(data).join(" ").toLowerCase().includes(queryString)) return data;
        });

        if (results.length) {
            if (results.length < 100) {
                return results;
            }
        }
    }

    return [];
}

module.exports.copyData = (key) => {
    clipboard.write()
}