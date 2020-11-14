const getPage = require('./page.js');
const common = require('./common.js');

function setUpDisplay(driver, color_depth) {
    driver.dev_init();
    if(color_depth == common.BW) {
        driver.init();
    } else if (color_depth == common.GREY) {
        driver.init_4Gray();
    }
    driver.clear();
}

async function renderBrowser(screen, wss, epaperApp, url, color_depth) {
    setUpDisplay(screen.driver, color_depth);
    const page = await getPage(screen, color_depth);
    wss.on('connection', (ws) => {
        epaperApp(page, ws);
    });

    await page.goto(url);
}

module.exports = renderBrowser;
