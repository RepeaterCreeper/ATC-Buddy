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

module.exports.generateSquawk = function() {
    let min = USER_DATA['settings']['fsd']['squawkRange'][0],
        max = USER_DATA['settings']['fsd']['squawkRange'][1];

    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports.sendMessage = (options, socket) => {

    // Hard coded since we only have TM right now.
    socket.write(`#TM${USER_DATA['client']['callsign']}:${options.receiver}:${options.content}\r\n`);
}

module.exports.requestFP = function(aircraftCallsign) {
    FSD_DATA["awaiting"].push(aircraftCallsign);
    socket.write(`$CQ${USER_DATA["client"]["callsign"]}:SERVER:FP:${aircraftCallsign}`);
}

module.exports.parseContent = function(content) {
    const args = [...arguments];
	
	const allVariables = content.match(/\[.*?\]/g);
    const keyVariables = content.match(/(?<=\[).*(?=\])/g);
    
	if (allVariables) {
    	allVariables.forEach((variable, index) => {
        	content = content.replace(variable, args[1][keyVariables[index]])
    	});
    }

    return content;
}

module.exports.buildData = (type, options) => {
    function checkOptions(checkedObject, required) {
        if (JSON.stringify(Object.keys(checkedObject)) == JSON.stringify(required)) return true;

        //throw new Error(`Required options needs to be filled out: ${required}`);;
        return false;
    }

    switch (type) {
        case "textMessage": // Build Text Message Packet
            if (checkOptions(options, ["receiver", "content"])) { // Check all required options is present
                return `#TM[ATC_CALLSIGN]:${options.receiver}:${options.content}`;
            }
        break;
    }
    
}

module.exports.copyData = (key) => {
    clipboard.write()
}