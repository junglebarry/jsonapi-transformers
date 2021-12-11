import { ResourceIdentifier } from "./types";

/**
 * JSON:API base class providing `id` and `type` for resources.
 */
export class JsonapiEntity<E extends JsonapiEntity<E>>
  implements ResourceIdentifier
{
  id: string;
  readonly type: string;

  constructor(properties: Partial<E> = {}) {
    Object.keys(properties).forEach((property) => {
      this[property] = properties[property];
    });
  }
}
