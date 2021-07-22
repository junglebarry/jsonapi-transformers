"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkMetadata = exports.link = void 0;
var metadata_map_1 = require("./metadata-map");
var utils_1 = require("./utils");
var LINKS_MAP = new metadata_map_1.MetadataMap();
function link(options) {
    var opts = options || {};
    return function (target, key) {
        LINKS_MAP.setMetadataByType(target.constructor.name, key, Object.assign({
            name: key,
        }, opts));
    };
}
exports.link = link;
function getLinkMetadata(target) {
    return utils_1.getEntityPrototypeChain(target).reduce(function (soFar, prototype) { return Object.assign(soFar, LINKS_MAP.getMetadataByType(prototype.name)); }, {});
}
exports.getLinkMetadata = getLinkMetadata;
