const express = require('express');
const devices = require('./devices.js');
const readline = require('readline');
const WebSocket = require('ws');
const renderBrowser = require('./render.js');

const defaultConfig = {
    webPort: 3000,
    websocketPort: 8080,
    staticDirectory: 'static',
    url: `http://localhost:3000/index.html`,
};

const defaultRenderCallback = (page, ws) => {
    page.onConsoleLog((msg) => console.log(msg));

    ws.on('message', async (message) => {
        if (message === 'render') {
            await page.display();
        }
    });
};

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

function setupExitOnSignal(driver) {
    const handle = () => {
        driver.sleep();
        process.exit();
    };

    process.on('SIGINT', handle);
    process.on('SIGTERM', handle);
}

function init(
    screen = devices.waveshare4in2,
    config = {},
    renderCallback = defaultRenderCallback
) {
    const configWithDefaults = { ...defaultConfig, ...config };

    if (process.stdin.isTTY) {
        setupKeyInput(screen.driver);
    } else {
        setupExitOnSignal(screen.driver);
    }

    const wss = new WebSocket.Server({
        port: configWithDefaults.websocketPort,
    });

    if (!configWithDefaults.skipWebServer) {
        const app = express();

        app.use(express.static(configWithDefaults.staticDirectory));
        app.listen(configWithDefaults.webPort, () => {
            renderBrowser(screen, wss, renderCallback, configWithDefaults.url);
        });
    } else {
        renderBrowser(screen, wss, renderCallback, configWithDefaults.url);
    }
}

module.exports = { init, devices };
