const getPage = require('./page');

function setUpDisplay(screen) {
    screen.driver.dev_init();
    screen.init();
    screen.driver.clear();
}

async function renderBrowser(screen, wss, epaperApp, url, config) {
    setUpDisplay(screen);
    const page = await getPage(screen, config);
    wss.on('connection', (ws) => {
        epaperApp(page, ws);
    });

    await page.goto(url);
}

module.exports = renderBrowser;
