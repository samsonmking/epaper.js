const puppeteer = require('puppeteer-core');
const convertPNGto1BitBuffer = require('./image.js');

class Page {
    constructor(browserPage, screen) {
        this.browserPage = browserPage;
        this.screen = screen;
        this.sleeping = false;
    }

    async display() {
        const pageImage = await this.browserPage.screenshot({
            type: 'png',
            fullpage: 'true',
            encoding: 'binary'
        });
        const displayBuffer = await convertPNGto1BitBuffer(pageImage);

        if (this.sleeping) {
            this.screen.driver.init();
            this.sleeping = false;
        } else if(this.handle) {
            clearTimeout(this.handle);
        }
            
        this.screen.driver.display(displayBuffer);
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

async function getPage(screen) {
    const browser = await puppeteer.launch({ executablePath: 'chromium-browser' });
    const browserPage = await browser.newPage();
    await browserPage.setViewport({
        width: screen.width,
        height: screen.height,
        deviceScaleFactor: 1
    });
    return new Page(browserPage, screen);
}

module.exports = getPage;
