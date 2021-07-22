"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntityPrototypeChain = void 0;
var jsonapi_1 = require("../jsonapi");
function getEntityPrototypeChain(targetType) {
    var proto = Object.getPrototypeOf(targetType);
    if (proto.prototype instanceof jsonapi_1.JsonapiEntity) {
        return __spreadArrays(getEntityPrototypeChain(proto), [targetType]);
    }
    return [targetType];
}
exports.getEntityPrototypeChain = getEntityPrototypeChain;
