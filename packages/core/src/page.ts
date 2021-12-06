import puppeteer from 'puppeteer-core';

export class SinglePage {
    private readonly HTTP_NOT_MODIFIED = 304;

    constructor(private readonly browser: puppeteer.Browser, private readonly browserPage: puppeteer.Page) {}

    async display(url: string): Promise<Buffer> {
        const responce = await this.browserPage.goto(url, {
            waitUntil: 'networkidle2',
        });
        if (!responce?.ok() && responce?.status() !== this.HTTP_NOT_MODIFIED) {
            console.log(responce);
            throw new Error(`Error occured navigating to ${url}: ${responce?.statusText()}`);
        }

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
    const context = await browser.createIncognitoBrowserContext();
    const browserPage = await context.newPage();
    await browserPage.setViewport({
        width,
        height,
        deviceScaleFactor: 1,
    });
    return new SinglePage(browser, browserPage);
}
