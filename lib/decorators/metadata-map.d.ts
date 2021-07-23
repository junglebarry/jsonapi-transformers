export declare type MetadataByPropertyName<T> = {
    [attributeName: string]: T;
};
export declare type PropertyTypesForType<T> = Map<any, MetadataByPropertyName<T>>;
export declare class MetadataMap<T> {
    private metadataByType;
    getMetadataByType(classType: any): MetadataByPropertyName<T>;
    setMetadataByType(classType: any, keyName: string, metadata: T): void;
}
