import { ResourceIdentifier, ResourceObject, TopLevel } from '../jsonapi';
/**
 * A class that encapsulates all traversed and included ResourceObject instances
 * as it deserialises JSON:API responses.
 */
export declare class JsonApiDeserialiser {
    private includes;
    constructor(initialIncludes?: ResourceObject[]);
    /**
     * Perform deserialisation of a response into a single object instance.
     *
     * @param {TopLevel} topLevel - the JSON:API response, to deserialise
     * @type {T} t the type of response expected - a `ResourceIdentifier` subtype
     * @return {T} the deserialised response object
     */
    deserialiseOne<T extends ResourceIdentifier>(topLevel: TopLevel): T;
    /**
     * Perform deserialisation of a response into a list of object instances.
     *
     * @param {TopLevel} topLevel - the JSON:API response, to deserialise
     * @type {T} t the type of response expected - a `ResourceIdentifier` subtype
     * @return {T[]} the deserialised response objects, as an array
     */
    deserialiseMany<T extends ResourceIdentifier>(topLevel: TopLevel): T[];
    deserialise<T extends ResourceIdentifier>(topLevel: TopLevel): T | T[];
}
/**
 * Perform deserialisation of a response into a single object instance, discarding included ResourceObjects
 *
 * @param {TopLevel} topLevel - the JSON:API response, to deserialise
 * @type {T} t the type of response expected - a `ResourceIdentifier` subtype
 * @return {T} the deserialised response object
 */
export declare function deserialiseOne<T extends ResourceIdentifier>(topLevel: TopLevel): T;
/**
 * Perform deserialisation of a response into a list of object instances, discarding included ResourceObjects
 *
 * @param {TopLevel} topLevel - the JSON:API response, to deserialise
 * @type {T} t the type of response expected - a `ResourceIdentifier` subtype
 * @return {T[]} the deserialised response objects, as an array
 */
export declare function deserialiseMany<T extends ResourceIdentifier>(topLevel: TopLevel): T[];
