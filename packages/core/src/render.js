const getPage = require('./page.js');

function setUpDisplay(screen) {
    screen.driver.dev_init();
    screen.init();
    screen.driver.clear();
}

async function renderBrowser(screen, wss, epaperApp, url) {
    setUpDisplay(screen);
    const page = await getPage(screen);
    wss.on('connection', (ws) => {
        epaperApp(page, ws);
    });

    await page.goto(url);
}

module.exports = renderBrowser;
