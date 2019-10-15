"use strict";
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
    return function (original) {
        // a utility function to generate instances of a class
        var construct = function (constructorFunc, args) {
            var CustomJsonapiEntity = function () {
                return new (constructorFunc.bind.apply(constructorFunc, [void 0].concat(args)))();
            };
            CustomJsonapiEntity.prototype = constructorFunc.prototype;
            // construct an instance and bind "type" correctly
            var instance = new CustomJsonapiEntity();
            instance.type = type;
            return instance;
        };
        // the new constructor behaviour
        var wrappedConstructor = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return construct(original, args);
        };
        // copy prototype so intanceof operator still works
        wrappedConstructor.prototype = original.prototype;
        // add the type to the reverse lookup for deserialisation
        exports.ENTITIES_MAP.set(type, wrappedConstructor);
        // return new constructor (will override original)
        return wrappedConstructor;
    };
}
exports.entity = entity;
