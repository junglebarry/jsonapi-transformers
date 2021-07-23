import { ResourceIdentifier } from '../jsonapi';
export interface ResourceIdentifierConstructor {
    new (...args: any[]): ResourceIdentifier;
}
export declare class TypeMap {
    private constructorsByJsonapiType;
    get(typeName: string): ResourceIdentifierConstructor;
    set(typeName: string, constructorType: ResourceIdentifierConstructor): void;
}
export declare const ENTITIES_MAP: TypeMap;
export declare function getClassForJsonapiType(type: string): ResourceIdentifierConstructor;
export declare function getConstructorForJsonapiType(type: string): Function;
export interface EntityOptions {
    type: string;
}
/**
 * Annotates a class to indicate that it is a JSON:API entity definition.
 *
 * Any class annotated with `@entity` should be considered serialisable to JSON:API,
 * and should have `@attribute` and `@relationship` decorators to indicate properties
 * to be serialisable to and deserialisable from appropriate JSON:API data.
 *
 */
export declare function entity(options: EntityOptions): (ResourceIdentifierConstructor: any) => any;
