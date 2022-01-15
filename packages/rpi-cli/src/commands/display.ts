import { ColorMode, DisplayDevice, getPageRpi, Orientation, BrowserPage } from '@epaperjs/core';
import { getDevice } from '../deviceFactory';
import { Command } from './command';

export interface DisplayArgs extends BaseArgs {
    url: string;
    orientation?: Orientation;
    colorMode?: ColorMode;
    screenshotDelay?: number;
}

export class DisplayCommand implements Command<DisplayArgs> {
    private displayDevice?: DisplayDevice;
    private browserPage?: BrowserPage;

    public async execute(displayArgs: DisplayArgs) {
        const { deviceType, orientation, colorMode, url } = displayArgs;

        this.displayDevice = await getDevice(deviceType, orientation, colorMode);
        this.displayDevice.connect();

        this.browserPage = await getPageRpi(this.displayDevice.width, this.displayDevice.height);
        const imgOfUrl = await this.browserPage.screenshot(url, { delay: displayArgs.screenshotDelay });
        await this.displayDevice.displayPng(imgOfUrl);
    }

    public async dispose() {
        this.displayDevice?.sleep();
        await this.browserPage?.close();
    }
}
