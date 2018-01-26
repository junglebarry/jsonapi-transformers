export interface MetaOptions {
    name?: string;
}
export declare function meta(options?: MetaOptions): PropertyDecorator;
export declare type MetaMetadata = {
    [name: string]: MetaOptions;
};
export declare function getMetaMetadata(target: any): MetaMetadata;
