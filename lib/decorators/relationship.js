"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelationshipMetadata = exports.relationship = void 0;
var metadata_map_1 = require("./metadata-map");
var utils_1 = require("./utils");
var RELATIONSHIPS_MAP = new metadata_map_1.MetadataMap();
var DefaultRelationshipOptions = {
    allowUnresolvedIdentifiers: false,
};
function relationship(options) {
    var opts = Object.assign({}, DefaultRelationshipOptions, options || {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target, key) {
        RELATIONSHIPS_MAP.setMetadataByType(target.constructor, key, Object.assign({
            name: key,
        }, opts));
    };
}
exports.relationship = relationship;
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
function getRelationshipMetadata(target) {
    return utils_1.getEntityPrototypeChain(target).reduce(function (soFar, prototype) { return Object.assign(soFar, RELATIONSHIPS_MAP.getMetadataByType(prototype)); }, {});
}
exports.getRelationshipMetadata = getRelationshipMetadata;
