import puppeteer from 'puppeteer-core';
import { DisplayDevice } from './api';

export class Page {
    constructor(private readonly browserPage: puppeteer.Page) {}

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

    onConsoleLog(callback: (msg: string) => void) {
        this.browserPage.on('console', (msg) => callback(msg.text()));
    }
}

export async function getPage(width: number, height: number) {
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
    return new Page(browserPage);
}
