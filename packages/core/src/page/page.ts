import puppeteer from 'puppeteer-core';
import { Logger } from '../logger';

export interface ScreenshotOptions {
    delay?: number;
    username?: string;
    password?: string;
}

export class BrowserPage {
    private readonly HTTP_NOT_MODIFIED = 304;

    constructor(
        private readonly browser: puppeteer.Browser,
        private readonly browserPage: puppeteer.Page,
        private readonly logger?: Logger
    ) {
        this.browserPage.on('console', (msg) => {
            this.logger?.debug(`Browser console.${msg.type()}`, msg.text(), msg.stackTrace());
        });
    }

    async screenshot(url: string, options: ScreenshotOptions = {}): Promise<Buffer> {
        if (options.username && options.password) {
            await this.browserPage.authenticate({ username: options.username, password: options.password });
        }
        const response = await this.browserPage.goto(url, {
            waitUntil: 'networkidle0',
        });
        if (!response?.ok() && response?.status() !== this.HTTP_NOT_MODIFIED) {
            throw new Error(`Error occurred navigating to ${url}: ${response?.statusText()}`);
        }
        if (options.delay) {
            this.logger?.debug(`Waiting an additional ${options.delay}ms before taking screenshot`);
            await this.browserPage.waitForTimeout(options.delay);
            this.logger?.debug('Screenshot delay complete');
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
