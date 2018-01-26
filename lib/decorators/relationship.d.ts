export interface RelationshipOptions {
    allowUnresolvedIdentifiers?: boolean;
    name?: string;
}
export declare function relationship(options?: RelationshipOptions): PropertyDecorator;
export declare type RelationshipMetadata = {
    [name: string]: RelationshipOptions;
};
export declare function getRelationshipMetadata(target: any): RelationshipMetadata;
