export interface LinkOptions {
    name?: string;
}
export declare function link(options?: LinkOptions): PropertyDecorator;
export declare type LinkMetadata = {
    [name: string]: LinkOptions;
};
export declare function getLinkMetadata(target: any): LinkMetadata;
