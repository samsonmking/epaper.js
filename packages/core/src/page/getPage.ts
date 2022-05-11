import puppeteer from 'puppeteer-core';
import { Logger } from '../logger';
import { BrowserPage } from './page';

export async function getPageRpi(width: number, height: number, logger?: Logger) {
    const browser = await puppeteer.launch({
        executablePath: 'chromium-browser',
        args: ['--font-render-hinting=slight', '--no-sandbox', '--disable-setuid-sandbox'],
    });
    const context = await browser.createIncognitoBrowserContext();
    const browserPage = await context.newPage();
    await browserPage.setViewport({
        width,
        height,
        deviceScaleFactor: 1,
    });
    return new BrowserPage(browser, browserPage, logger);
}
