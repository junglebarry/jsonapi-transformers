import { ResourceIdentifier } from "./types.js";

/**
 * JSON:API base class providing `id` and `type` for resources.
 */
export class JsonapiEntity<E extends JsonapiEntity<E>>
  implements ResourceIdentifier
{
  id!: string;
  readonly type!: string;

  constructor(properties: Partial<E> = {}) {
    const { type, ...props } = properties;
    Object.assign(this, props);
    const proto = new.target.prototype;
    if (!this.type && proto && proto.type) {
      this.type = proto.type;
    } else if (!this.type && type) {
      this.type = type;
    }
  }

  static create<E extends JsonapiEntity<E>>(
    this: JsonapiEntityConstructor<E>,
    properties: Partial<E> = {}
  ): E {
    return newEntity(this, properties);
  }
}

export interface JsonapiEntityConstructor<E extends JsonapiEntity<E>> {
  new (properties: Partial<E>): E;
}

export function newEntity<E extends JsonapiEntity<E>>(
  entity: JsonapiEntityConstructor<E>,
  properties: Partial<E> = {}
): E {
  return Object.assign(new entity(properties), properties);
}
