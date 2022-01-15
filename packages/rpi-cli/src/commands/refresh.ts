import { DisplayDevice, getPageRpi, BrowserPage } from '@epaperjs/core';
import { getDevice } from '../deviceFactory';
import { Command } from './command';
import { DisplayArgs } from './display';

export interface RefreshArgs extends DisplayArgs {
    time?: number;
}

export class RefreshCommand implements Command<RefreshArgs> {
    private displayDevice?: DisplayDevice;
    private browserPage?: BrowserPage;

    public async execute(refreshArgs: RefreshArgs) {
        const { deviceType, orientation, colorMode, url, time } = refreshArgs;

        this.displayDevice = await getDevice(deviceType, orientation, colorMode);
        this.displayDevice.connect();

        this.browserPage = await getPageRpi(this.displayDevice.width, this.displayDevice.height);

        while (true) {
            const imgOfUrl = await this.browserPage.screenshot(url, { delay: refreshArgs.screenshotDelay });
            this.displayDevice.wake();
            await this.displayDevice.displayPng(imgOfUrl);
            this.displayDevice.sleep();
            await this.sleep(time);
        }
    }

    public async dispose() {
        this.displayDevice?.sleep();
        await this.browserPage?.close();
    }

    private sleep(seconds: number = 15) {
        return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    }
}
