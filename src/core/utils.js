const { clipboard } = require("electron");

module.exports.showResults = (queryString, typeContainer, key) => {
    let favoritesList = USER_DATA["favorites"][key].map((favorite) => JSON.stringify(favorite));

    queryString = queryString.toLowerCase();

    if (queryString.length >= 1) {
        let results = typeContainer.filter((data) => {
            if (Object.values(data).join(" ").toLowerCase().includes(queryString)) {

                // [Temporary Fix]
                if (!favoritesList.includes(JSON.stringify(data))) {
                    return data;
                }
            }
        });

        let customResults = USER_CUSTOM_DATA[key].filter((data) => {
            if (Object.values(data).join(" ").toLowerCase().includes(queryString)) {

                // [Temporary Fix]
                if (!favoritesList.includes(JSON.stringify(data))) {
                    return data;
                }
            }
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