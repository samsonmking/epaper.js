const getPage = require('./page.js');
const common = require('./common.js');

function setUpDisplay(screen, color_depth) {
    screen.driver.dev_init();
    if(color_depth == common.BW) {
        screen.driver.init();
    } else if (color_depth == common.GREY && screen.support_grey) {
        screen.driver.init_4Gray();
    }
    screen.driver.clear();
}

async function renderBrowser(screen, wss, epaperApp, url, color_depth) {
    setUpDisplay(screen, color_depth);
    const page = await getPage(screen, color_depth);
    wss.on('connection', (ws) => {
        epaperApp(page, ws);
    });

    await page.goto(url);
}

module.exports = renderBrowser;
