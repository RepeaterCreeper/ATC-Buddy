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

module.exports.calculateBearing = function(startLat, startLon, destLat, destLon) {
    startLat = startLat * Math.PI / 180;
    startLng = startLon * Math.PI / 180;
    destLat = destLat * Math.PI / 180;
    destLng = destLon * Math.PI / 180;
    
    y = Math.sin(destLng - startLng) * Math.cos(destLat);
    x = Math.cos(startLat) * Math.sin(destLat) -
            Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    brng = Math.atan2(y, x);
    brng = brng * 180 / Math.PI;

    return ((brng + 360) % 360) - 12;
}

module.exports.updateFP = function(callsign, index, keyValue) {
    FSD_DATA["awaiting"][callsign]["flightPlanData"][index] = keyValue;
    console.log(`$AM${USER_DATA['client']['callsign']}:SERVER:${callsign}:${FSD_DATA['awaiting'][callsign]["flightPlanData"].join(":")}\r\n$CQSAN_TWR:@94835:FA:${callsign}:${FSD_DATA['awaiting'][callsign]['flightPlanData'][8]}\r\n`);
    socket.write(`$AM${USER_DATA['client']['callsign']}:SERVER:${callsign}:${FSD_DATA['awaiting'][callsign]["flightPlanData"].join(":")}\r\n$CQSAN_TWR:@94835:FA:${callsign}:${FSD_DATA['awaiting'][callsign]['flightPlanData'][8]}\r\n`);
}

module.exports.generateSquawk = function() {
    let min = parseInt(USER_DATA['settings']['fsd']['squawkRange'][0]),
        max = parseInt(USER_DATA['settings']['fsd']['squawkRange'][1]);

    if (min > max) {
        throw new Error("Bruh! Why you do that. Min is always LESS THAN max.");
    }

    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports.sendMessage = (cbe, callsign, socket) => {
    const args = [...arguments];

    let content = cbe.content;

    const REGEX_BUDDY_DATA = /(?<=\<).*(?=\>)/;
	const allVariables = content.match(/\[.*?\]/g);
    const keyVariables = content.match(/(?<=\[).*(?=\])/g);

    let aircraftData = FSD_DATA["awaiting"][callsign],
        flightPlanData = aircraftData["flightPlanData"];

    let objectACData = {
        "AC_CALLSIGN": callsign,
        "SCRATCHPAD": aircraftData["generalInfo"]["scratchpad"],
        "DEP_RWY": ""
    }

    if (flightPlanData[flightPlanData.length - 2].match(REGEX_BUDDY_DATA)) {
        objectACData["DEP_RWY"] = flightPlanData[flightPlanData.length - 2].match(REGEX_BUDDY_DATA)[0]
    }

    
	if (allVariables) {
    	allVariables.forEach((variable, index) => {
        	content = content.replace(variable, objectACData[keyVariables[index]])
    	});
    }
    
    socket.write(`#TM${USER_DATA['client']['callsign']}:${cbe.receiver}:${content}\r\n`);
}

module.exports.requestFP = function(aircraftCallsign) {
    FSD_DATA["awaiting"].push(aircraftCallsign);
    socket.write(`$CQ${USER_DATA["client"]["callsign"]}:SERVER:FP:${aircraftCallsign}`);
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