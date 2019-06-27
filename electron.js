const { app, BrowserWindow, ipcMain } = require("electron");

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

    loadingWindow = new BrowserWindow({
        resizable: false,
        show: true,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false
    });

    loadingWindow.loadFile("./src/loading.html");
    
    mainWin.loadFile("./src/index.html");
    mainWin.setIcon("./src/icons/icon.png");

    ipcMain.once("atc-buddy", function(event, messages){
        mainWin.show();

        loadingWindow.close();
    });

    /* mainWin.loadFile("./src/index.html");
    mainWin.setIcon("./src/icons/icon.png");
    
    mainWin.on("ready-to-show", () => mainWin.show()); */
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
});

/**
 * IPC Event Channels
 */
/* ipcMain.on("atc-buddy", (event, messages) => {
    console.log(event, messages);
}); */