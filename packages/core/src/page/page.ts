import puppeteer from 'puppeteer-core';

export interface ScreenshotOptions {
    delay?: number;
}

export class BrowserPage {
    private readonly HTTP_NOT_MODIFIED = 304;

    constructor(private readonly browser: puppeteer.Browser, private readonly browserPage: puppeteer.Page) {}

    async screenshot(url: string, options: ScreenshotOptions = {}): Promise<Buffer> {
        const responce = await this.browserPage.goto(url, {
            waitUntil: 'networkidle2',
        });
        if (!responce?.ok() && responce?.status() !== this.HTTP_NOT_MODIFIED) {
            throw new Error(`Error occured navigating to ${url}: ${responce?.statusText()}`);
        }
        if (options.delay) {
            await this.browserPage.waitForTimeout(options.delay);
        }
        return (await this.browserPage.screenshot({
            type: 'png',
            fullPage: false,
            encoding: 'binary',
        })) as Buffer;
    }

    async close() {
        await this.browser.close();
    }

    onConsoleLog(callback: (msg: string) => void) {
        this.browserPage.on('console', (msg) => callback(msg.text()));
    }
}
