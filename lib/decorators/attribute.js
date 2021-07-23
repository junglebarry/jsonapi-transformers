"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttributeMetadata = exports.attribute = void 0;
var metadata_map_1 = require("./metadata-map");
var utils_1 = require("./utils");
var ATTRIBUTES_MAP = new metadata_map_1.MetadataMap();
function attribute(options) {
    var opts = options || {};
    return function (target, key) {
        ATTRIBUTES_MAP.setMetadataByType(target.constructor, key, Object.assign({
            name: key,
        }, opts));
    };
}
exports.attribute = attribute;
function getAttributeMetadata(target) {
    return utils_1.getEntityPrototypeChain(target).reduce(function (soFar, prototype) { return Object.assign(soFar, ATTRIBUTES_MAP.getMetadataByType(prototype)); }, {});
}
exports.getAttributeMetadata = getAttributeMetadata;
