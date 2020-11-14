const puppeteer = require('puppeteer-core');
const common = require('./common.js');

class Page {
    constructor(browserPage, screen, color_depth) {
        this.browserPage = browserPage;
        this.screen = screen;
        this.sleeping = false;
        this.color_depth = color_depth;
    }

    async display() {
        const pageImage = await this.browserPage.screenshot({
            type: 'png',
            fullpage: 'true',
            encoding: 'binary'
        });

        if (this.sleeping) {
            if (this.color_depth == common.BW) {
                this.screen.driver.init();
            } else if (this.color_depth == common.GREY && this.screen.support_grey) {
                this.screen.driver.init_4Gray();
            }
            this.sleeping = false;
        } else if (this.handle) {
            clearTimeout(this.handle);
        }

        await this.screen.displayPNG(pageImage, this.color_depth);
        this.handle = setTimeout(() => {
            this.screen.driver.sleep();
            this.sleeping = true;
        }, 60000);
    }

    async goto(url) {
        return await this.browserPage.goto(url);
    }

    onConsoleLog(callback) {
        this.browserPage.on('console', msg => callback(msg.text()));
    }

}

async function getPage(screen, color_depth) {
    const browser = await puppeteer.launch({ executablePath: 'chromium-browser' });
    const browserPage = await browser.newPage();
    await browserPage.setViewport({
        width: screen.width,
        height: screen.height,
        deviceScaleFactor: 1
    });
    return new Page(browserPage, screen, color_depth);
}

module.exports = getPage;
