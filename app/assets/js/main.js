/**
 * ZLA Info Tool
 */
// Initial
M.AutoInit();

const INFO_TOOL_DATA = require("./assets/data/data");

let sessionData;

if (!localStorage.getItem("data")) {
    localStorage.setItem("data", JSON.stringify({
        "sectionActive": "aircraft_types"
    }));

    sessionData = JSON.parse(localStorage.getItem("data"));
} else {
    sessionData = JSON.parse(localStorage.getItem("data"));
}


function switchSections(id) {
    let specifiedSection = document.querySelector(`section[data-section='${id}']`),
        sectionNavButton = document.querySelector(`a[data-section-target='${id}']`).parentElement;

    if (specifiedSection.className == "hide") {
        specifiedSection.classList.toggle("hide");
        sectionNavButton.classList.toggle("active");

        document.querySelector(`section[data-section='${sessionData.sectionActive}']`).classList.toggle("hide");
        document.querySelector(`a[data-section-target='${sessionData.sectionActive}']`).parentElement.classList.toggle("active");

        sessionData.sectionActive = id;

        /**
         * Simple check if sidenavTrigger is visible and if it is visible we can
         * assume that they're in desktop view meaning sidenav is supposed to be
         * fixed. Hence why we don't need to close the sidenav when they press a
         * nav-item.
         */
        let sidenavTrigger = document.querySelector(".sidenav-trigger");
        if (sidenavTrigger.offsetWidth > 0 || sidenavTrigger.offsetHeight > 0) {
            M.Sidenav.getInstance(document.querySelector(".sidenav")).close();
        }
    }
}

function showResults(queryString, type) {
    let container_target = document.querySelector(`ul[data-result-type=${type}]`);

    queryString = queryString.toLowerCase();
    container_target.innerHTML = "";

    if (queryString.length >= 1) {
        let results = INFO_TOOL_DATA[type].filter((data) => {
            if (Object.values(data).join(" ").toLowerCase().includes(queryString)) return data;
        });

        if (results.length) {
            if (results.length < 100) {
                results.forEach((result) => {
                    let li = document.createElement("li");
                    switch (type) {
                        case "aircraft_types":
                            li.innerHTML = `
                                <div class="row" style="margin-bottom: 0; display: flex; overflow-y: hidden;">
                                    <div class="col s8" style="height: 42px;">
                                        <b>${result.manufacturer}</b><br>
                                        <p style="margin: 0">${result.model}</p>
                                    </div>
                                    <div class="col s2" style="display: table; height: 42px;">
                                        <span style="vertical-align: middle; display: table-cell;">${result.code}</span>
                                    </div>
                                    <div class="col s1" style="display: table; height: 42px;">
                                        <span style="vertical-align: middle; display: table-cell;">${result.tec_class}</span>
                                    </div>
                                    <div class="col s1" style="display: table; height: 42px;">
                                        <span style="vertical-align: middle; display: table-cell;">${result.weight_class}</span>
                                    </div>
                                </div>
                            `;
                            break;
                        case "airlines":
                            li.innerHTML = `
                                <div class="row" style="margin-bottom: 0;">
                                    <div class="col s1" style="display: table; height: 42px;">
                                        <span style="vertical-align: middle; display: table-cell;">${result.code}</span>
                                    </div>
                                    <div class="col s3" style="display: table; height: 42px;">
                                        <span style="vertical-align: middle; display: table-cell;">${result.callsign}</span>
                                    </div>
                                    <div class="col s8" style="height: 42px; display: table;">
                                        <b style="vertical-align: middle; display: table-cell;">${result.name}</b>
                                    </div>
                                </div>
                            `;
                            break;
                        case "airports":
                            li.innerHTML = `
                                <div class="row" style="margin-bottom: 0;">
                                    <div class="col s1" style="height: 42px; display: table;">
                                        <b style="vertical-align: middle;display: table-cell;">${result.icao}</b>
                                    </div>
                                    <div class="col s9">
                                        <b>${result.name}</b>
                                        <p style="margin: 0;">${result.city}, ${result.country}</p>
                                    </div>
                                </div>
                            `;
                            break;
                        case "scratchpad_codes":
                            li.innerHTML = `
                                <div class="row" style="margin-bottom: 0;">
                                    <div class="col s1" style="height: 42px; display: table; border-right: 1px solid #ffc8c89e;">
                                        <b style="vertical-align: middle; display: table-cell">${result.icao}</b>
                                    </div>
                                    <div class="col s3" style="height: 42px; display: table; ">
                                        <span style="vertical-align: middle; display: table-cell">${result.procedure}</span>
                                    </div>
                                    <div class="col s3" style="height: 42px; display: table;">
                                        <span style="vertical-align: middle; display: table-cell">${result.transition}</span>
                                    </div>
                                    <div class="col s5" style="height: 42px; display: table; text-align: right;">
                                        <span style="vertical-align: middle; display: table-cell">${result.scratch}</span>
                                    </div>
                                </div>
                            `;
                        
                    }
                    li.className = "collection-item";

                    container_target.append(li);
                });
            }
        }
    }
}

/**
 * General
 */
document.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-section-target")) {
        switchSections(event.target.getAttribute("data-section-target"));
    }
});