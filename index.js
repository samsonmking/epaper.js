const express = require('express');
const app = express();
const waveshare4In2Driver = require('bindings')('waveshare4in2.node');
const puppeteer = require('puppeteer-core');
const convertPNGto1BitBuffer = require('./image.js');
const readline = require('readline');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

function setUpDisplay(driver) {
    driver.dev_init();
    driver.init();
}

class Page {
    constructor(browserPage, screen) {
        this.browserPage = browserPage;
        this.screen = screen;
    }

    async display() {
        const pageImage = await this.browserPage.screenshot({
            type: 'png',
            fullpage: 'true',
            encoding: 'binary'
        });
        const displayBuffer = await convertPNGto1BitBuffer(pageImage);
        this.screen.driver.display(displayBuffer);
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


async function renderBrowser(screen, epaperApp) {
    setUpDisplay(screen.driver);
    const page = await getPage(screen);

    wss.on('connection', (ws) => {
        epaperApp(page, ws);
    });

    await page.goto('http://localhost:3000/index.html');
}

function setupKeyInput(driver) {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.addListener('keypress', (key, data) => {
        if (data.ctrl && data.name === 'c') {
            driver.sleep();
            process.exit();
        }
    });
}

function init(screen, epaperApp, config) {
    setupKeyInput(screen.driver);
    app.use(express.static(config.staticDirectory));
    app.listen(3000, () => {
        renderBrowser(screen, epaperApp);
    });
}

const devices = {
    waveshare4in2: {
        height: 300,
        width: 400,
        driver: waveshare4In2Driver
    }
}

module.exports = { init, devices };
