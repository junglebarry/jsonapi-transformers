import { MetadataMap, } from './metadata-map';
import { getEntityPrototypeChain } from './utils';
const ATTRIBUTES_MAP = new MetadataMap();
export function attribute(options) {
    const opts = options || {};
    return (target, key) => {
        ATTRIBUTES_MAP.setMetadataByType(target.constructor.name, key, Object.assign({
            name: key,
        }, opts));
    };
}
export function getAttributeMetadata(target) {
    return getEntityPrototypeChain(target).reduce((soFar, prototype) => Object.assign(soFar, ATTRIBUTES_MAP.getMetadataByType(prototype.name)), {});
}
