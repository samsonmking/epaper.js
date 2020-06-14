const fs = require("fs");

function readBitmapFileHeader(filedata) {
  return {
    filesize: filedata.readInt32LE(2),
    imageDataOffset: filedata.readInt32LE(10)
  };
}

const dibHeaderLengthToVersionMap = {
  12: "BITMAPCOREHEADER",
  16: "OS22XBITMAPHEADER",
  40: "BITMAPINFOHEADER",
  52: "BITMAPV2INFOHEADER",
  56: "BITMAPV3INFOHEADER",
  64: "OS22XBITMAPHEADER",
  108: "BITMAPV4HEADER",
  124: "BITMAPV5HEADER"
};

function readDibHeader(filedata) {
  const dibHeaderLength = filedata.readInt32LE(14);
  const header = {};
  header.headerLength = dibHeaderLength;
  header.headerType = dibHeaderLengthToVersionMap[dibHeaderLength];
  header.width = filedata.readInt32LE(18);
  header.height = filedata.readInt32LE(22);
  if (header.headerType == "BITMAPCOREHEADER") {
    return header;
  }
  header.bitsPerPixel = filedata.readInt16LE(28);
  header.compressionType = filedata.readInt32LE(30);
  if (header.headerType == "OS22XBITMAPHEADER") {
    return header;
  }
  header.bitmapDataSize = filedata.readInt32LE(34);
  header.numberOfColorsInPalette = filedata.readInt32LE(46);
  header.numberOfImportantColors = filedata.readInt32LE(50);
  if (header.headerType == "BITMAPINFOHEADER") {
    return header;
  }
  // There are more data fields in later versions of the dib header.
  // I hear that BITMAPINFOHEADER is the most widely supported
  // header type, so I'm not going to implement them yet.
  return header;
}

function readColorTable(filedata) {
  const dibHeader = readDibHeader(filedata);
  const colorTable = Buffer.alloc(dibHeader.numberOfColorsInPalette * 4);
  const sourceStart = 14 + dibHeader.headerLength;
  filedata.copy(colorTable, 0, 54, 54 + colorTable.length);
  return colorTable;
}

function readBitmapFile(file) {
  const filedata = fs.readFileSync(file);
  const fileHeader = readBitmapFileHeader(filedata);
  const dibHeader = readDibHeader(filedata);
  const imageDataLength = dibHeader.bitmapDataSize;
  const imageDataOffset = fileHeader.imageDataOffset;
  const imageData = Buffer.alloc(imageDataLength);
  const colorTable = readColorTable(filedata);
  filedata.copy(imageData, 0, imageDataOffset);
  return {
    fileHeader,
    dibHeader,
    imageData,
    colorTable
  };
}

function convert24to1BitData(imageData, width, height) {
  const outBuffer = Buffer.alloc(Math.ceil(width / 8) * height, 0xff);
  let pos = 0;
  while (pos < imageData.length) {
    let b = imageData[pos++];
    let g = imageData[pos++];
    let r = imageData[pos++];
    let brightness = r * 0.2126 + g * 0.7152 + b * 0.0722;
    if (brightness < 200) {
      let pixel_count = Math.floor(pos / 3);
      let x = Math.floor(pixel_count % width);
      let y = Math.floor(pixel_count / width);
      out_index = Math.floor((x + y * width) / 8)
      outBuffer[out_index] &= ~(0x80 >> Math.floor(x % 8));
    }

  }
  return outBuffer;
}


module.exports = {
  readBitmapFileHeader,
  readDibHeader,
  readBitmapFile,
  readColorTable,
  convert24to1BitData
};
