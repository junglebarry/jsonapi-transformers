import {
  JsonapiEntity,
  ResourceObject,
  TopLevelResourceDatum,
  TopLevelResourcesData,
} from "../jsonapi";

import {
  fromJsonApiTopLevelResourceDatum,
  fromJsonApiTopLevelResourcesData,
} from "./deserialisers";

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
   * @type {T} t the type of response expected - a `JsonapiEntity` subtype
   * @return {T} the deserialised response object
   */
  deserialiseOne<T extends JsonapiEntity<T>>(
    topLevel: TopLevelResourceDatum
  ): T {
    const { deserialised, referents } = fromJsonApiTopLevelResourceDatum<T>(
      topLevel,
      this.includes
    );
    this.includes = referents;
    return deserialised;
  }

  /**
   * Perform deserialisation of a response into a list of object instances.
   *
   * @param {TopLevel} topLevel - the JSON:API response, to deserialise
   * @type {T} t the type of response expected - a `JsonapiEntity` subtype
   * @return {T[]} the deserialised response objects, as an array
   */
  deserialiseMany<T extends JsonapiEntity<T>>(
    topLevel: TopLevelResourcesData
  ): T[] {
    const { deserialised, referents } = fromJsonApiTopLevelResourcesData<T>(
      topLevel,
      this.includes
    );
    this.includes = referents;
    return deserialised;
  }
}

/**
 * Perform deserialisation of a response into a single object instance, discarding included ResourceObjects
 *
 * @param {TopLevel} topLevel - the JSON:API response, to deserialise
 * @type {T} t the type of response expected - a `JsonapiEntity` subtype
 * @return {T} the deserialised response object
 */
export function deserialiseOne<T extends JsonapiEntity<T>>(
  topLevel: TopLevelResourceDatum
): T {
  const { deserialised } = fromJsonApiTopLevelResourceDatum<T>(topLevel);
  return deserialised;
}

/**
 * Perform deserialisation of a response into a list of object instances, discarding included ResourceObjects
 *
 * @param {TopLevel} topLevel - the JSON:API response, to deserialise
 * @type {T} t the type of response expected - a `JsonapiEntity` subtype
 * @return {T[]} the deserialised response objects, as an array
 */
export function deserialiseMany<T extends JsonapiEntity<T>>(
  topLevel: TopLevelResourcesData
): T[] {
  const { deserialised } = fromJsonApiTopLevelResourcesData<T>(topLevel);
  return deserialised;
}
