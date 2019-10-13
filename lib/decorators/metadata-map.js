export class MetadataMap {
    constructor() {
        this.metadataByType = {};
    }
    getMetadataByType(typeName) {
        return this.metadataByType[typeName] || {};
    }
    setMetadataByType(typeName, keyName, metadata) {
        this.metadataByType[typeName] = Object.assign({}, this.getMetadataByType(typeName), {
            [keyName]: metadata,
        });
    }
}
