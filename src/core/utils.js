const { clipboard } = require("electron");

module.exports.showResults = (queryString, typeContainer, key) => {
    queryString = queryString.toLowerCase();

    if (queryString.length >= 1) {
        let results = typeContainer.filter((data) => {
            if (Object.values(data).join(" ").toLowerCase().includes(queryString)) return data;
        });

        let customResults = USER_CUSTOM_DATA[key].filter((data) => {
            if (Object.values(data).join(" ").toLowerCase().includes(queryString)) return data;
        });

        results = [...customResults, ...results];

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