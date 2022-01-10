const puppeteer = require('puppeteer-core');

class Page {
    constructor(browserPage, screen, config) {
        this.browserPage = browserPage;
        this.screen = screen;
        this.config = config || {};
        this.sleeping = false;
        this.browserPage.on(
            'error',
            async (error) => await this._reloadOnError()
        );
    }

    async display() {
        const pageImage = await this.browserPage.screenshot({
            type: 'png',
            fullpage: 'true',
            encoding: 'binary',
        });

        if (this.sleeping) {
            this.screen.init();
            this.sleeping = false;
        } else if (this.handle) {
            clearTimeout(this.handle);
        }

        await this.screen.displayPNG(pageImage, this.config.enableDithering);
        this.handle = setTimeout(() => {
            this.screen.driver.sleep();
            this.sleeping = true;
        }, 60000);
    }

    async goto(url) {
        this.lastUrl = url;
        return await this.browserPage.goto(url);
    }

    onConsoleLog(callback) {
        this.browserPage.on('console', (msg) => callback(msg.text()));
    }

    async _reloadOnError() {
        if (this.lastUrl) {
            await this.goto(this.lastUrl);
        }
    }
}

async function getPage(screen, config) {
    const browser = await puppeteer.launch({
        executablePath: 'chromium-browser',
        args: ['--font-render-hinting=slight'],
    });
    const browserPage = await browser.newPage();
    await browserPage.setViewport({
        width: screen.width,
        height: screen.height,
        deviceScaleFactor: 1,
    });
    return new Page(browserPage, screen, config);
}

module.exports = getPage;
