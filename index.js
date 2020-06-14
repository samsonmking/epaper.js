const epaper = require('bindings')('epaper');
const fs = require('fs');
const { readBitmapFile, convert24to1BitData } = require('./bitmap.js');

const height = 300;
const width = 400;

const bmpData = readBitmapFile('e30.bmp');
const compressed = convert24to1BitData(bmpData.imageData, width, height);

epaper.dev_init();
epaper.init();
// epaper.clear();
epaper.display(compressed);
epaper.sleep();
