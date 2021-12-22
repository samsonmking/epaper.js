import { ColorMode, DisplayDevice, getBrowserPage, Orientation, SinglePage } from '@epaperjs/core';
import { getDevice } from '../deviceFactory';
import { Command } from './command';

export interface DisplayArgs extends BaseArgs {
    url: string;
    orientation?: Orientation;
    colorMode?: ColorMode;
}

export class DisplayCommand implements Command<DisplayArgs> {
    private displayDevice?: DisplayDevice;
    private browserPage?: SinglePage;

    public async execute(displayArgs: DisplayArgs) {
        const { deviceType, orientation, colorMode, url } = displayArgs;

        const displayDevice = await getDevice(deviceType, orientation, colorMode);
        if (!displayDevice) {
            throw new Error(`device type ${deviceType} not recognized`);
        }
        displayDevice.init();

        this.browserPage = await getBrowserPage(displayDevice.width, displayDevice.height);
        const imgOfUrl = await this.browserPage.display(url);
        await displayDevice.displayPng(imgOfUrl);
    }

    public async dispose() {
        this.displayDevice?.sleep();
        await this.browserPage?.close();
    }
}
