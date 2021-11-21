import { getBrowserPage, Orientation } from '@epaperjs/core';
import { DeviceFactory } from '../deviceFactory';

export class DisplayCommand {
    private readonly deviceFactory: DeviceFactory;

    constructor() {
        this.deviceFactory = new DeviceFactory();
    }

    async display(deviceType: string, url: string, orientation?: string) {
        const displayDevice = await this.deviceFactory.getDevice(deviceType, this.getOrientation(orientation));
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

    private getOrientation(orientation: string | undefined): Orientation {
        return orientation === 'v' ? Orientation.Vertical : Orientation.Horizontal;
    }
}
