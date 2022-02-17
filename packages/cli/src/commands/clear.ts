import { DisplayDevice, Logger } from '@epaperjs/core';
import { getDevice } from '../deviceFactory';
import { Command } from './command';

export class ClearCommand implements Command<BaseArgs> {
    private displayDevice?: DisplayDevice;

    constructor(private readonly logger: Logger) {}

    public async execute(clearArgs: BaseArgs) {
        const { deviceType } = clearArgs;
        this.displayDevice = await getDevice(deviceType);
        this.logger.log(`Connecting to ${deviceType} screen`);
        this.displayDevice.connect();
        this.logger.log('Clearing screen');
        this.displayDevice.clear();
    }

    public async dispose() {
        this.logger.log('Powering off display and exiting...');
        this.displayDevice?.disconnect();
    }
}
