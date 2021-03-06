"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var metadata_map_1 = require("./metadata-map");
var utils_1 = require("./utils");
var RELATIONSHIPS_MAP = new metadata_map_1.MetadataMap();
var DefaultRelationshipOptions = {
    allowUnresolvedIdentifiers: false,
};
function relationship(options) {
    var opts = Object.assign({}, DefaultRelationshipOptions, options || {});
    return function (target, key) {
        RELATIONSHIPS_MAP.setMetadataByType(target.constructor.name, key, Object.assign({
            name: key,
        }, opts));
    };
}
exports.relationship = relationship;
function getRelationshipMetadata(target) {
    return utils_1.getEntityPrototypeChain(target).reduce(function (soFar, prototype) { return Object.assign(soFar, RELATIONSHIPS_MAP.getMetadataByType(prototype.name)); }, {});
}
exports.getRelationshipMetadata = getRelationshipMetadata;
