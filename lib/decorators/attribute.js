"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var metadata_map_1 = require("./metadata-map");
var ATTRIBUTES_MAP = new metadata_map_1.MetadataMap();
function attribute(options) {
    var opts = options || {};
    return function (target, key) {
        ATTRIBUTES_MAP.setMetadataByType(target.constructor.name, key, Object.assign({
            name: key,
        }, opts));
    };
}
exports.attribute = attribute;
function getAttributeMetadata(target) {
    return ATTRIBUTES_MAP.getMetadataByType(target.name);
}
exports.getAttributeMetadata = getAttributeMetadata;
