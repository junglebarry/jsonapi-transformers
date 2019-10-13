import { MetadataMap, } from './metadata-map';
import { getEntityPrototypeChain } from './utils';
const RELATIONSHIPS_MAP = new MetadataMap();
const DefaultRelationshipOptions = {
    allowUnresolvedIdentifiers: false,
};
export function relationship(options) {
    const opts = Object.assign({}, DefaultRelationshipOptions, options || {});
    return (target, key) => {
        RELATIONSHIPS_MAP.setMetadataByType(target.constructor.name, key, Object.assign({
            name: key,
        }, opts));
    };
}
export function getRelationshipMetadata(target) {
    return getEntityPrototypeChain(target).reduce((soFar, prototype) => Object.assign(soFar, RELATIONSHIPS_MAP.getMetadataByType(prototype.name)), {});
}
