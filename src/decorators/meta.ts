import {
  MetadataMap,
} from './metadata-map';

import { getEntityPrototypeChain } from './utils';

const META_PROPERTIES_MAP = new MetadataMap<MetaOptions>();

export interface MetaOptions {
  name?: string;
}

export function meta(options?: MetaOptions): PropertyDecorator {
  const opts = options || {};
  return (target: any, key: string) => {
    META_PROPERTIES_MAP.setMetadataByType(target.constructor, key, Object.assign({
      name: key,
    }, opts));
  }
}

export type MetaMetadata = { [name: string]: MetaOptions };

export function getMetaMetadata(target: any): MetaMetadata {
  return getEntityPrototypeChain(target).reduce(
    (soFar, prototype) => Object.assign(soFar, META_PROPERTIES_MAP.getMetadataByType(prototype)),
    {}
  );
}
