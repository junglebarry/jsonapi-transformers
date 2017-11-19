import {
  MetadataMap,
} from './metadata-map';

import { getEntityPrototypeChain } from './utils';

const LINKS_MAP = new MetadataMap<LinkOptions>();

export interface LinkOptions {
  name?: string;
}

export function link(options?: LinkOptions): PropertyDecorator {
  const opts = options || {};
  return (target: any, key: string) => {
    LINKS_MAP.setMetadataByType(target.constructor.name, key, Object.assign({
      name: key,
    }, opts));
  }
}

export type LinkMetadata = { [name: string]: LinkOptions };

export function getLinkMetadata(target: any): LinkMetadata {
  return getEntityPrototypeChain(target).reduce(
    (soFar, prototype) => Object.assign(soFar, LINKS_MAP.getMetadataByType(prototype.name)),
    {}
  );
}
