const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

/**
 * Variable Declarations
 */
const VERSION = "1.2.1";

let mainWin;

/**
 * Function Declarations
 */

function init() {
    //checkUpdate();

    mainWin = new BrowserWindow({
        /* resizable: false,
        maxWidth: 800,
        maxHeight: 600, */
        minWidth: 800,
        minHeight: 600,
        show: false,
        webPreferences: {
            // temporary, we'll transfer over to a much more secure code in later development.
            nodeIntegration: true
        }
    });

    loadingWindow = new BrowserWindow({
        resizable: false,
        show: true,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false
    });

    loadingWindow.loadFile(path.join(__dirname, "./src/loading.html"));
    
    mainWin.loadFile(path.join(__dirname, "./src/index.html"));
    mainWin.setIcon(path.join(__dirname, "./src/icons/icon.png"));
    
    // mainWin.show();

    ipcMain.once("atc-buddy", function(event, messages){
        mainWin.show();

        loadingWindow.close();
    });
}

/**
 * IPC Channels
 */
ipcMain.on("atcb-fsd", function(event, message){
    console.log(`[Event] ${event} | [Message] ${message}`);
});

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
});