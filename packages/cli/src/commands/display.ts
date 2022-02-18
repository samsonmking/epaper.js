import { ColorMode, DisplayDevice, getPageRpi, Orientation, BrowserPage, Logger } from '@epaperjs/core';
import { getDevice } from '../deviceFactory';
import { Command } from './command';

export interface DisplayArgs extends BaseArgs {
    url: string;
    orientation?: Orientation;
    colorMode?: ColorMode;
    screenshotDelay?: number;
    dither?: boolean;
    username?: string;
    password?: string;
}

export class DisplayCommand implements Command<DisplayArgs> {
    private displayDevice?: DisplayDevice;
    private browserPage?: BrowserPage;

    constructor(private readonly logger: Logger) {}

    public async execute(displayArgs: DisplayArgs) {
        const { deviceType, orientation, colorMode, url, dither } = displayArgs;

        this.logger.log(`Connecting to ${deviceType} screen`);
        this.displayDevice = await getDevice(deviceType, orientation, colorMode);
        await this.displayDevice.connect();
        this.logger.log(`Connected`);

        this.browserPage = await getPageRpi(this.displayDevice.width, this.displayDevice.height, this.logger);
        this.logger.log(`Displaying ${url}`);
        const imgOfUrl = await this.browserPage.screenshot(url, {
            delay: displayArgs.screenshotDelay,
            username: displayArgs.username,
            password: displayArgs.password,
        });
        await this.displayDevice.displayPng(imgOfUrl, { dither });
    }

    public async dispose() {
        this.logger.log('Powering off display and exiting...');
        await this.displayDevice?.disconnect();
        await this.browserPage?.close();
    }
}
