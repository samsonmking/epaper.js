const express = require('express');
const app = express();
const epaper = require('bindings')('epaper.node');
const puppeteer = require('puppeteer-core');
const convertPNGto1BitBuffer = require('./image.js');
const readline = require('readline');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const height = 300;
const width = 400;

async function renderBrowser() {
    setUpDisplay();
    const browser = await puppeteer.launch({ executablePath: 'chromium-browser' });
    const page = await browser.newPage();
    await page.setViewport({
        width,
        height,
        deviceScaleFactor: 1
    });
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    wss.on('connection', (ws) => {
        ws.on('message', async (message) => {
            if(message === 'render') {
                await display(page);
            }
        });

        process.stdin.addListener('keypress', (key, data) => {
            if(data.name === 'left') {
                ws.send('left');
            }
            if(data.name === 'right') {
                ws.send('right');
            }
        });
    });

    await page.goto('http://localhost:3000/index.html');
}

function setUpDisplay() {
    epaper.dev_init();
    epaper.init();
}

async function display(page) {
    const pageImage = await page.screenshot({
        type: 'png',
        fullpage: 'true',
        encoding: 'binary'
    });
    const displayBuffer = await convertPNGto1BitBuffer(pageImage);
    epaper.display(displayBuffer);
}

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.addListener('keypress', (key, data) => {
    if(data.ctrl && data.name === 'c') {
        epaper.sleep();
        process.exit();
    }
});

app.use(express.static('static'));
app.listen(3000, () => {
    renderBrowser();
});
