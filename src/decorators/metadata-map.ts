export type MetadataByPropertyName<T> = { [attributeName: string]: T };
export type PropertyTypesForType<T> = { [typeName: string]: MetadataByPropertyName<T> };

export class MetadataMap<T> {
  private metadataByType: PropertyTypesForType<T> = {};

  getMetadataByType(typeName: string): MetadataByPropertyName<T> {
    return this.metadataByType[typeName] || {};
  }

  setMetadataByType(typeName: string, keyName: string, metadata: T): void {
    this.metadataByType[typeName] = Object.assign({}, this.getMetadataByType(typeName), {
      [keyName]: metadata,
    });
  }
}
