export interface Logger {
    log(message?: any, ...optionalParams: any[]): void;
    error(error: Error | string): void;
}

export class ConsoleLogger implements Logger {
    constructor(private readonly debug: boolean = false) {}
    log(message?: any, ...optionalParams: any[]): void {
        if (this.debug) {
            console.log(message, ...optionalParams);
        }
    }
    error(error: Error | string): void {
        if (error instanceof Error && !this.debug) {
            console.error(`ERROR: ${error.message}`);
        } else {
            console.error(error);
        }
    }
}
