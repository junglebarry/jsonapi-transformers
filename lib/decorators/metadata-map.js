"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataMap = void 0;
var MetadataMap = /** @class */ (function () {
    function MetadataMap() {
        this.metadataByType = {};
    }
    MetadataMap.prototype.getMetadataByType = function (typeName) {
        return this.metadataByType[typeName] || {};
    };
    MetadataMap.prototype.setMetadataByType = function (typeName, keyName, metadata) {
        var _a;
        this.metadataByType[typeName] = Object.assign({}, this.getMetadataByType(typeName), (_a = {},
            _a[keyName] = metadata,
            _a));
    };
    return MetadataMap;
}());
exports.MetadataMap = MetadataMap;
