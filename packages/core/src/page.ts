import puppeteer from 'puppeteer-core';

export class BrowserPage {
    constructor(private readonly browser: puppeteer.Browser, private readonly browserPage: puppeteer.Page) {}

    async display(url: string): Promise<Buffer> {
        await this.browserPage.goto(url, {
            waitUntil: 'networkidle2',
        });
        return await this.browserPage.screenshot({
            type: 'png',
            fullPage: false,
            encoding: 'binary',
        });
    }

    async close() {
        await this.browser.close();
    }

    onConsoleLog(callback: (msg: string) => void) {
        this.browserPage.on('console', (msg) => callback(msg.text()));
    }
}

export async function getBrowserPage(width: number, height: number) {
    const browser = await puppeteer.launch({
        executablePath: 'chromium-browser',
        args: ['--font-render-hinting=slight'],
    });
    const browserPage = await browser.newPage();
    await browserPage.setViewport({
        width,
        height,
        deviceScaleFactor: 1,
    });
    return new BrowserPage(browser, browserPage);
}
