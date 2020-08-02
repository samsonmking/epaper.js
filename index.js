const express = require('express');
const getPage = require('./page.js');
const devices = require('./devices.js');
const readline = require('readline');
const WebSocket = require('ws');

const app = express();
const wss = new WebSocket.Server({ port: 8080 });

function setUpDisplay(driver) {
    driver.dev_init();
    driver.init();
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

module.exports = { init, devices };
