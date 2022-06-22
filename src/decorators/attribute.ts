import { MetadataMap } from "./metadata-map.js";

import { getEntityPrototypeChain } from "./utils.js";

const ATTRIBUTES_MAP = new MetadataMap<AttributeOptions>();

export interface AttributeOptions {
  name?: string;
}

export function attribute(options?: AttributeOptions): PropertyDecorator {
  const opts = options || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any, key: string) => {
    ATTRIBUTES_MAP.setMetadataByType(
      target.constructor,
      key,
      Object.assign(
        {
          name: key,
        },
        opts
      )
    );
  };
}

export type AttributeMetadata = { [name: string]: AttributeOptions };

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function getAttributeMetadata(target: any): AttributeMetadata {
  return getEntityPrototypeChain(target).reduce(
    (soFar, prototype) =>
      Object.assign(soFar, ATTRIBUTES_MAP.getMetadataByType(prototype)),
    {}
  );
}
