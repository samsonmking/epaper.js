const express = require('express');
const devices = require('./devices.js');
const readline = require('readline');
const WebSocket = require('ws');
const renderBrowser = require('./render.js');
const common = require('./common.js');

const defaultConfig = {
    webPort: 3000,
    websocketPort: 8080,
    staticDirectory: 'static',
    url: `http://localhost:3000/index.html`,
    color_depth: common.GREY //1BitBW or 1Bit4Grey
};

const defaultRenderCallback = (page, ws) => {
    page.onConsoleLog(msg => console.log(msg));

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

function init(screen = devices.waveshare4in2,
    config = {},
    renderCallback = defaultRenderCallback) {
    const configWithDefaults = { ...defaultConfig, ...config };

    const app = express();
    const wss = new WebSocket.Server({ port: configWithDefaults.websocketPort });

    setupKeyInput(screen.driver);

    app.use(express.static(configWithDefaults.staticDirectory));
    app.listen(configWithDefaults.webPort, () => {
        renderBrowser(screen, wss, renderCallback, configWithDefaults.url, configWithDefaults.color_depth);
    });
}

module.exports = { init, devices };
