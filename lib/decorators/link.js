import { MetadataMap, } from './metadata-map';
import { getEntityPrototypeChain } from './utils';
const LINKS_MAP = new MetadataMap();
export function link(options) {
    const opts = options || {};
    return (target, key) => {
        LINKS_MAP.setMetadataByType(target.constructor.name, key, Object.assign({
            name: key,
        }, opts));
    };
}
export function getLinkMetadata(target) {
    return getEntityPrototypeChain(target).reduce((soFar, prototype) => Object.assign(soFar, LINKS_MAP.getMetadataByType(prototype.name)), {});
}
