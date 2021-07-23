"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataMap = void 0;
var MetadataMap = /** @class */ (function () {
    function MetadataMap() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.metadataByType = new Map();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    MetadataMap.prototype.getMetadataByType = function (classType) {
        return this.metadataByType.get(classType) || {};
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    MetadataMap.prototype.setMetadataByType = function (classType, keyName, metadata) {
        var _a;
        this.metadataByType.set(classType, Object.assign({}, this.getMetadataByType(classType), (_a = {}, _a[keyName] = metadata, _a)));
    };
    return MetadataMap;
}());
exports.MetadataMap = MetadataMap;
