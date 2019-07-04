const { clipboard } = require("electron");

module.exports.showResults = (queryString, typeContainer, key) => {
    let favoritesList = USER_DATA["favorites"][key].map((favorite) => JSON.stringify(favorite));

    queryString = queryString.toLowerCase();

    if (queryString.length >= 1) {
        let results = [...typeContainer, ...USER_CUSTOM_DATA[key]];
        
        results = results.filter((data) => {
            if (Object.values(data).join(" ").toLowerCase().includes(queryString) &&
                !favoritesList.includes(JSON.stringify(data))) return data;
        });
        
        if (results.length < 100) return results;
    }

    return [];
}

module.exports.copyData = (key) => {
    clipboard.write()
}