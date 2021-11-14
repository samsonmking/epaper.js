"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrowserPage = exports.BrowserPage = void 0;
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
class BrowserPage {
    constructor(browser, browserPage) {
        this.browser = browser;
        this.browserPage = browserPage;
    }
    async display(url) {
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
    onConsoleLog(callback) {
        this.browserPage.on('console', (msg) => callback(msg.text()));
    }
}
exports.BrowserPage = BrowserPage;
async function getBrowserPage(width, height) {
    const browser = await puppeteer_core_1.default.launch({
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
exports.getBrowserPage = getBrowserPage;
