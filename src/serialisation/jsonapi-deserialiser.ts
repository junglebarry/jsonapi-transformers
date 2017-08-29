import {
  ResourceIdentifier,
  ResourceObject,
  TopLevel,
} from '../jsonapi';

import { fromJsonApiTopLevel } from './deserialisers';

/**
 * A class that encapsulates all traversed and included ResourceObject instances
 * as it deserialises JSON:API responses.
 */
export class JsonApiDeserialiser {
  private includes: ResourceObject[];

  constructor(initialIncludes: ResourceObject[] = []) {
    this.includes = initialIncludes;
  }

  /**
   * Perform deserialisation of a response into a single object instance.
   *
   * @param {TopLevel} topLevel - the JSON:API response, to deserialise
   * @type {T} t the type of response expected - a `ResourceIdentifier` subtype
   * @return {T} the deserialised response object
   */
  deserialiseOne<T extends ResourceIdentifier>(topLevel: TopLevel): T {
    const { deserialised, referents } = fromJsonApiTopLevel(topLevel, this.includes);
    this.includes = referents;
    return deserialised as T;
  }

  /**
   * Perform deserialisation of a response into a list of object instances.
   *
   * @param {TopLevel} topLevel - the JSON:API response, to deserialise
   * @type {T} t the type of response expected - a `ResourceIdentifier` subtype
   * @return {T[]} the deserialised response objects, as an array
   */
  deserialiseMany<T extends ResourceIdentifier>(topLevel: TopLevel): T[] {
    const { deserialised, referents } = fromJsonApiTopLevel(topLevel, this.includes);
    this.includes = referents;
    return deserialised as T[];
  }

  deserialise<T extends ResourceIdentifier>(topLevel: TopLevel): T | T[] {
    if (topLevel && topLevel.data && Array.isArray(topLevel.data)) {
      return this.deserialiseMany<T>(topLevel);
    } else if (topLevel && topLevel.data) {
      return this.deserialiseOne<T>(topLevel);
    }

    throw new Error('No primary data to deserialise');
  }
}

/**
 * Perform deserialisation of a response into a single object instance, discarding included ResourceObjects
 *
 * @param {TopLevel} topLevel - the JSON:API response, to deserialise
 * @type {T} t the type of response expected - a `ResourceIdentifier` subtype
 * @return {T} the deserialised response object
 */
export function deserialiseOne<T extends ResourceIdentifier>(topLevel: TopLevel): T {
  const { deserialised } = fromJsonApiTopLevel(topLevel);
  return deserialised as T;
}

/**
 * Perform deserialisation of a response into a list of object instances, discarding included ResourceObjects
 *
 * @param {TopLevel} topLevel - the JSON:API response, to deserialise
 * @type {T} t the type of response expected - a `ResourceIdentifier` subtype
 * @return {T[]} the deserialised response objects, as an array
 */
export function deserialiseMany<T extends ResourceIdentifier>(topLevel: TopLevel): T[] {
  const { deserialised } = fromJsonApiTopLevel(topLevel);
  return deserialised as T[];
}
