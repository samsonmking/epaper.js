import { getPage } from '@epaperjs/core';
import { DeviceFactory } from '../deviceFactory';

export class DisplayCommand {
    private readonly deviceFactory: DeviceFactory;

    constructor() {
        this.deviceFactory = new DeviceFactory();
    }

    async display(deviceType: string, url: string) {
        const displayDevice = await this.deviceFactory.getDevice(deviceType);
        if (!displayDevice) {
            throw new Error(`device type ${deviceType} not recognized`);
        }
        displayDevice.init();

        const page = await getPage(displayDevice.width, displayDevice.height);
        const imgOfUrl = await page.display(url);
        displayDevice.displayPng(imgOfUrl);
        displayDevice.sleep();
    }
}
