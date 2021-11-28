import { ColorMode, getBrowserPage, Orientation } from '@epaperjs/core';
import { getDevice } from '../deviceFactory';

export class DisplayCommand {
    async display(deviceType: string, url: string, orientation?: Orientation, colorMode?: ColorMode) {
        const displayDevice = await getDevice(deviceType, orientation, colorMode);
        if (!displayDevice) {
            throw new Error(`device type ${deviceType} not recognized`);
        }
        displayDevice.init();

        const browserPage = await getBrowserPage(displayDevice.width, displayDevice.height);
        const imgOfUrl = await browserPage.display(url);
        await displayDevice.displayPng(imgOfUrl);
        displayDevice.sleep();
        await browserPage.close();
    }
}
