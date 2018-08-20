"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonapi_1 = require("../jsonapi");
function getEntityPrototypeChain(targetType) {
    var proto = Object.getPrototypeOf(targetType);
    if (proto.prototype instanceof jsonapi_1.JsonapiEntity) {
        return getEntityPrototypeChain(proto).concat([targetType]);
    }
    return [targetType];
}
exports.getEntityPrototypeChain = getEntityPrototypeChain;
