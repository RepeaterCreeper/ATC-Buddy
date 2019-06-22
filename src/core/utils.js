module.exports.showResults = (queryString, type) => {
    queryString = queryString.toLowerCase();

    if (queryString.length >= 1) {
        let results = INFO_TOOL_DATA[type].filter((data) => {
            if (Object.values(data).join(" ").toLowerCase().includes(queryString)) return data;
        });

        if (results.length) {
            if (results.length < 100) {
                return results;
            }
        }
    }
}

module.exports.copyData = (key) => {
    
}