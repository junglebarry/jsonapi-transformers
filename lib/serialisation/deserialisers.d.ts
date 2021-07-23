import { ResourceObject, TopLevel } from "../jsonapi";
/**
 * Key a resource object by type and ID.
 *
 * @param  {ResourceObject} obj - a resource object
 * @return {string} - a key for an object identifier
 */
export declare function byTypeAndId(obj: ResourceObject): string;
/**
 * Resource objects, keyed by type-and-id
 * @type { { [string]: ResourceObject } }
 */
export declare type IncludedLookup = {
    [typeAndId: string]: ResourceObject;
};
/**
 * Deserialised objects, keyed by type-and-id
 * @type { { [string]: any } }
 */
export declare type DeserialisedLookup = {
    [typeAndId: string]: any;
};
/**
 * Deserialise an entity or entities from JSON:API.
 *
 * @param  {TopLevel} topLevel - a JSON:API top-level
 * @param  {ResourceObject[]} resourceObjects - known resource objects, for resolution
 * @return {any} - an entity or entities representing the top-level
 */
export declare function fromJsonApiTopLevel(topLevel: TopLevel, resourceObjects?: ResourceObject[]): any;
/**
 * Deserialise a resource object from JSON:API.
 *
 * @param  {ResourceObject} jsonapiResource - a resource object's JSON:API representation
 * @param  {IncludedLookup} resourceObjectsByTypeAndId - known resources, keyed by type-and-ID
 * @return {any} - a resource object, deserialised from JSON:API
 */
export declare function fromJsonApiResourceObject(jsonapiResource: ResourceObject, resourceObjectsByTypeAndId: IncludedLookup, deserialisedObjects?: DeserialisedLookup): any;
