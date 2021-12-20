export interface ImageOptions {
    rotate90Degrees?: boolean;
    blackThreshold?: number;
}

export const DefaultOptions: Required<ImageOptions> = {
    rotate90Degrees: false,
    blackThreshold: 127,
};
