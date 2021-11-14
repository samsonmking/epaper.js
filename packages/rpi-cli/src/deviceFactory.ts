import { DisplayDevice } from '@epaperjs/core';

export class DeviceFactory {
    private readonly deviceMap;
    constructor() {
        this.deviceMap = new Map<string, () => Promise<DisplayDevice>>([
            ['2in13v2', async () => await this.getRPi2in13V2()],
        ]);
    }

    public async getDevice(deviceType: string): Promise<DisplayDevice | undefined> {
        const factory = this.deviceMap.get(deviceType);
        return factory && (await factory());
    }

    private async getRPi2in13V2(): Promise<DisplayDevice> {
        const { Rpi2In13V2 } = await import('@epaperjs/rpi-2in13-v2');
        return new Rpi2In13V2();
    }
}
