import { Logger } from '@epaperjs/core';

export class ConsoleLogger implements Logger {
    constructor(private readonly debugEnabled: boolean = false) {}
    debug(message?: any, ...optionalParams: any[]) {
        if (this.debugEnabled) {
            console.log(`[DEBUG] ${message}`, ...optionalParams);
        }
    }

    log(message?: any, ...optionalParams: any[]): void {
        console.log(message, ...optionalParams);
    }

    error(error: Error | string): void {
        if (error instanceof Error && !this.debugEnabled) {
            console.error(`[ERROR] ${error.message}`);
        } else {
            console.error(error);
        }
    }
}
