import puppeteer from 'puppeteer-core';
import { BrowserPage } from './page';

export async function getPageRpi(width: number, height: number) {
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
    return new BrowserPage(browser, browserPage);
}
