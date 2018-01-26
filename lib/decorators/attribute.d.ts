export interface AttributeOptions {
    name?: string;
}
export declare function attribute(options?: AttributeOptions): PropertyDecorator;
export declare type AttributeMetadata = {
    [name: string]: AttributeOptions;
};
export declare function getAttributeMetadata(target: any): AttributeMetadata;
