const getPage = require('./page.js');

function setUpDisplay(driver) {
    driver.dev_init();
    driver.init();
}

async function renderBrowser(screen, wss, epaperApp, url) {
    setUpDisplay(screen.driver);
    const page = await getPage(screen);

    wss.on('connection', (ws) => {
        epaperApp(page, ws);
    });

    await page.goto(url);
}

module.exports = renderBrowser;
