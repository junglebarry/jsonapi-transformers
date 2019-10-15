"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var TypeMap = /** @class */ (function () {
    function TypeMap() {
        this.constructorsByJsonapiType = {};
    }
    TypeMap.prototype.get = function (typeName) {
        return this.constructorsByJsonapiType[typeName];
    };
    TypeMap.prototype.set = function (typeName, constructorType) {
        this.constructorsByJsonapiType[typeName] = constructorType;
    };
    return TypeMap;
}());
exports.TypeMap = TypeMap;
exports.ENTITIES_MAP = new TypeMap();
function getClassForJsonapiType(type) {
    return exports.ENTITIES_MAP.get(type);
}
exports.getClassForJsonapiType = getClassForJsonapiType;
function getConstructorForJsonapiType(type) {
    var clazz = getClassForJsonapiType(type);
    return clazz && clazz.prototype && clazz.prototype.constructor;
}
exports.getConstructorForJsonapiType = getConstructorForJsonapiType;
/**
 * Annotates a class to indicate that it is a JSON:API entity definition.
 *
 * Any class annotated with `@entity` should be considered serialisable to JSON:API,
 * and should have `@attribute` and `@relationship` decorators to indicate properties
 * to be serialisable to and deserialisable from appropriate JSON:API data.
 *
 */
function entity(options) {
    var type = options.type;
    return function (constructor) {
        var clazz = /** @class */ (function (_super) {
            __extends(CustomJsonapiEntity, _super);
            function CustomJsonapiEntity() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.type = type;
                return _this;
            }
            return CustomJsonapiEntity;
        }(constructor));
        exports.ENTITIES_MAP.set(type, clazz);
        return clazz;
    };
}
exports.entity = entity;
