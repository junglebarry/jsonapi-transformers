export class TypeMap {
    constructor() {
        this.constructorsByJsonapiType = {};
    }
    get(typeName) {
        return this.constructorsByJsonapiType[typeName];
    }
    set(typeName, constructorType) {
        this.constructorsByJsonapiType[typeName] = constructorType;
    }
}
export const ENTITIES_MAP = new TypeMap();
export function getClassForJsonapiType(type) {
    return ENTITIES_MAP.get(type);
}
export function getConstructorForJsonapiType(type) {
    const clazz = getClassForJsonapiType(type);
    return clazz && clazz.prototype && clazz.prototype.constructor;
}
/**
 * Annotates a class to indicate that it is a JSON:API entity definition.
 *
 * Any class annotated with `@entity` should be considered serialisable to JSON:API,
 * and should have `@attribute` and `@relationship` decorators to indicate properties
 * to be serialisable to and deserialisable from appropriate JSON:API data.
 *
 */
export function entity(options) {
    const { type } = options;
    return (constructor) => {
        // if unregisted, create the entity type, register, and return
        const clazz = class CustomJsonapiEntity extends constructor {
            constructor() {
                super(...arguments);
                this.type = type;
            }
        };
        ENTITIES_MAP.set(type, clazz);
        return clazz;
    };
}
