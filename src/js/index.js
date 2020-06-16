const express = require('express');
const app = express();
const epaper = require('bindings')('epaper.node');
const puppeteer = require('puppeteer-core');
const convertPNGto1BitBuffer = require('./image.js');
const readline = require('readline');

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
    page.on('console', msg => console.log('PAGE LOG:', msg.text));
    await page.goto('http://localhost:3000/index.html');
    await page.waitForFunction(() => window.ebookDisplayed === true);
    await display(page);

    pageCount = 0;
    process.stdin.addListener('keypress', async (key, data) => {
        if(data.name === 'left') {
            page.keyboard.press('ArrowLeft');
            await page.waitForFunction(pc => window.pageCount === pc, {}, --pageCount);
            await display(page);
        }
        if(data.name === 'right') {
            page.keyboard.press('ArrowRight');
            await page.waitForFunction(pc => window.pageCount === pc, {}, ++pageCount);
            await display(page);
        }
    });

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
        process.exit();
    }
});

app.use(express.static('static'));
app.listen(3000, () => {
    renderBrowser()
});
