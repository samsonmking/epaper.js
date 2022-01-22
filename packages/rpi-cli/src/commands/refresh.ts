import { DisplayDevice, getPageRpi, BrowserPage } from '@epaperjs/core';
import { getDevice } from '../deviceFactory';
import { Logger } from '../logger';
import { Command } from './command';
import { DisplayArgs } from './display';

export interface RefreshArgs extends DisplayArgs {
    interval?: number;
}

export class RefreshCommand implements Command<RefreshArgs> {
    private displayDevice?: DisplayDevice;
    private browserPage?: BrowserPage;

    constructor(private readonly logger: Logger) {}

    public async execute(refreshArgs: RefreshArgs) {
        const { deviceType, orientation, colorMode, url, interval, dither } = refreshArgs;

        this.logger.log(`Connecting to ${deviceType} screen`);
        this.displayDevice = await getDevice(deviceType, orientation, colorMode);
        this.displayDevice.connect();
        this.logger.log(`Connected`);

        this.browserPage = await getPageRpi(this.displayDevice.width, this.displayDevice.height);

        while (true) {
            const imgOfUrl = await this.browserPage.screenshot(url, { delay: refreshArgs.screenshotDelay });
            this.logger.log('Waking up display');
            this.displayDevice.wake();
            this.logger.log(`Displaying ${url}`);
            await this.displayDevice.displayPng(imgOfUrl, { dither });
            this.displayDevice.sleep();
            this.logger.log('Putting display into low power mode');
            await this.sleep(interval);
        }
    }

    public async dispose() {
        this.logger.log('Powering off display and exiting...');
        this.displayDevice?.disconnect();
        await this.browserPage?.close();
    }

    private sleep(seconds: number = 15) {
        if (seconds > 60) {
            const min = Math.floor(seconds / 60);
            const remainingSec = (seconds % 60).toString().padStart(2, '0');
            this.logger.log(`Next refresh in ${min}m:${remainingSec}s`);
        } else {
            this.logger.log(`Next refresh in ${seconds}s`);
        }
        return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    }
}
