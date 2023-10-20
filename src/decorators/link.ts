import { MetadataMap } from "./metadata-map";

import { getEntityPrototypeChain } from "./utils";

const LINKS_MAP = new MetadataMap<LinkOptions>();

export interface LinkOptions {
  name?: string;
}

export function link(options?: LinkOptions): PropertyDecorator {
  const opts = options || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any, key: string) => {
    LINKS_MAP.setMetadataByType(target.constructor, key, {
      name: key,
      ...opts,
    });
  };
}

export type LinkMetadata = { [name: string]: LinkOptions };

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function getLinkMetadata(target: any): LinkMetadata {
  return getEntityPrototypeChain(target).reduce(
    (soFar, prototype) =>
      Object.assign(soFar, LINKS_MAP.getMetadataByType(prototype)),
    {},
  );
}
