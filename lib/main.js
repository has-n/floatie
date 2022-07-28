const { ipcMain, BrowserWindow, screen } = require("electron");


const closeMenu = (parentWindow, floatieWindow) => {
    parentWindow.webContents.send('remove-focus')
    parentWindow.focus()
    floatieWindow.webContents.send('menu-blurred')
    floatieWindow.setIgnoreMouseEvents(true) // TALK - pointer event
}

const floatie = function (params) {
    const parentWindow = BrowserWindow.getFocusedWindow();

    const floatieWindow = new BrowserWindow({
        parent: parentWindow,
        title: 'menu',
        frame: false,
        transparent: false,
        hasShadow: false,
        resizable: false,
        skipTaskbar: true,
        show: false,
        width: 200, //Config.menu.width,
        height: 150 //Config.menu.height,
    });

    floatieWindow.loadFile(params.path);

    floatieWindow.on('focus', e => {
        // parentWindow.webContents.send('force-focus')
        floatieWindow.webContents.send('menu-focused')
        floatieWindow.setIgnoreMouseEvents(false)
    });

    // ipcMain.on('floatie-show', (e, { x, y, w, h, direction, arrow, pull }) => {
    ipcMain.on('floatie-show', (e, data) => {
        console.log(`menu-show in runtime`, data.bodyDims, data.targetDims);
        const parentWindow = BrowserWindow.getFocusedWindow();
        const bodyDims = data.bodyDims;
        const targetDims = data.targetDims;

        // determine which screen the parentWindow is on
        const parentBounds = parentWindow.getBounds();
        const activeScreen = screen.getDisplayNearestPoint({ x: parentBounds.x, y: parentBounds.y });
        const {screenWidth, screenHeight} = activeScreen.workAreaSize;
        const parentLeftEdge = parentBounds.x - activeScreen.bounds.x;
        const parentTopEdge = parentBounds.y - activeScreen.bounds.y;
        const parentBottomEdge = parentTopEdge + bodyDims.height;
        const confWidth = 216; //menuConf.width
        const confShadowLeft = 9; //menuConf.width
        const confShadowRight = 9; //menuConf.width
        const confShadowTop = 0; //16 //menuConf.width
        const confShadowBottom = 0; //16 //menuConf.width
        const confHeight = 250;//182 //menuConf.height
        const confMinHeight = 150; //menuConf.minHeight
        const pullLeftArrow = 20;
        const pullRightArrow = 180;

        console.log(`Parent left:${parentLeftEdge} top:${parentTopEdge} bottom:${parentBottomEdge}`);

        // compute where to display the Floatie
        var floatieX = Math.floor(parentLeftEdge + targetDims.left - (confWidth /2) + (targetDims.width /2));
        var floatieY = parentBottomEdge + targetDims.top;
        // adjust for multiple displays
        floatieX = activeScreen.bounds.x + floatieX;
        floatieY = activeScreen.bounds.y + floatieY;

        console.log(`FloatieX: ${floatieX} Y:${floatieY}`);

        // floatieWindow.webContents.send('menu-setup', { direction, arrow, pull })
        floatieWindow.setSize(200, 150)
        floatieWindow.setPosition(floatieX, floatieY)
        floatieWindow.show();
        floatieWindow.focus()
    });

    ipcMain.on('floatie-close', () => {
        console.log(`Menu close in runtime`);
        closeMenu();
    });

}


module.exports = floatie;