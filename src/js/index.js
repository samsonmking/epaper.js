const express = require('express');
const app = express();
const epaper = require('bindings')('epaper.node');
const puppeteer = require('puppeteer-core');
const convertPNGto1BitBuffer = require('./image.js');

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
    await page.goto('http://localhost:3000/index.html');
    await page.waitForFunction(() => window.ebookDisplayed === true);
    const pageImage = await page.screenshot({
        type: 'png',
        fullpage: 'true',
        encoding: 'binary'
    });
    const displayBuffer = await convertPNGto1BitBuffer(pageImage);
    display(displayBuffer);
}

function setUpDisplay() {
    epaper.dev_init();
    epaper.init();
}

function display(buffer) {
    epaper.display(buffer);
    epaper.sleep();
}

app.use(express.static('static'));
app.listen(3000, () => {
    renderBrowser()
});
