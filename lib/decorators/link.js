"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var metadata_map_1 = require("./metadata-map");
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
    return LINKS_MAP.getMetadataByType(target.name);
}
exports.getLinkMetadata = getLinkMetadata;
