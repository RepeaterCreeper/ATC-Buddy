const { app, BrowserWindow } = require("electron");
const path = require("path");

/**
 * Variable Declarations
 */
let mainWin;

/**
 * Function Declarations
 */

function init() {
    mainWin = new BrowserWindow({
        resizable: false,
        maxWidth: 800,
        maxHeight: 600,
        show: false,
        webPreferences: {
            // temporary, we'll transfer over to a much more secure code in later development.
            nodeIntegration: true
        }
    });

    mainWin.loadFile("./src/index.html");
    mainWin.setIcon("./src/icons/icon.png");
    
    mainWin.on("ready-to-show", () => mainWin.show());
}

/**
 * Event Handlers
 */
app.on("ready", () => {
    init();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})