import { MetadataMap, } from './metadata-map';
import { getEntityPrototypeChain } from './utils';
const META_PROPERTIES_MAP = new MetadataMap();
export function meta(options) {
    const opts = options || {};
    return (target, key) => {
        META_PROPERTIES_MAP.setMetadataByType(target.constructor.name, key, Object.assign({
            name: key,
        }, opts));
    };
}
export function getMetaMetadata(target) {
    return getEntityPrototypeChain(target).reduce((soFar, prototype) => Object.assign(soFar, META_PROPERTIES_MAP.getMetadataByType(prototype.name)), {});
}
