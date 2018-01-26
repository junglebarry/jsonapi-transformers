import { ResourceIdentifier, ResourceObject } from '../jsonapi';
/**
 * Convert a target JSON:API entity into a JSON:API representation.
 *
 * @param  {ResourceIdentifier} target - a source entity
 * @return {ResourceObject} a JSON:API resource representation
 */
export declare function toJsonApi(target: ResourceIdentifier): ResourceObject;
