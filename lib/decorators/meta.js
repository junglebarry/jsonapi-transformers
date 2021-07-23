"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetaMetadata = exports.meta = void 0;
var metadata_map_1 = require("./metadata-map");
var utils_1 = require("./utils");
var META_PROPERTIES_MAP = new metadata_map_1.MetadataMap();
function meta(options) {
    var opts = options || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target, key) {
        META_PROPERTIES_MAP.setMetadataByType(target.constructor, key, Object.assign({
            name: key,
        }, opts));
    };
}
exports.meta = meta;
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
function getMetaMetadata(target) {
    return utils_1.getEntityPrototypeChain(target).reduce(function (soFar, prototype) {
        return Object.assign(soFar, META_PROPERTIES_MAP.getMetadataByType(prototype));
    }, {});
}
exports.getMetaMetadata = getMetaMetadata;
