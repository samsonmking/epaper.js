export interface Command<T extends BaseArgs> {
    execute(args: T): Promise<void>;
    dispose(): Promise<void>;
}
