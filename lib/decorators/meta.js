"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var metadata_map_1 = require("./metadata-map");
var META_PROPERTIES_MAP = new metadata_map_1.MetadataMap();
function meta(options) {
    var opts = options || {};
    return function (target, key) {
        META_PROPERTIES_MAP.setMetadataByType(target.constructor.name, key, Object.assign({
            name: key,
        }, opts));
    };
}
exports.meta = meta;
function getMetaMetadata(target) {
    return META_PROPERTIES_MAP.getMetadataByType(target.name);
}
exports.getMetaMetadata = getMetaMetadata;
