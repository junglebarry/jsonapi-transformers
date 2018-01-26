export declare type MetadataByPropertyName<T> = {
    [attributeName: string]: T;
};
export declare type PropertyTypesForType<T> = {
    [typeName: string]: MetadataByPropertyName<T>;
};
export declare class MetadataMap<T> {
    private metadataByType;
    getMetadataByType(typeName: string): MetadataByPropertyName<T>;
    setMetadataByType(typeName: string, keyName: string, metadata: T): void;
}
