export type MetadataByPropertyName<T> = { [attributeName: string]: T };
export type PropertyTypesForType<T> = Map<any, MetadataByPropertyName<T>>;

export class MetadataMap<T> {
  private metadataByType = new Map<any, MetadataByPropertyName<T>>();

  getMetadataByType(classType: any): MetadataByPropertyName<T> {
    return this.metadataByType.get(classType) || {};
  }

  setMetadataByType(classType: any, keyName: string, metadata: T): void {
    this.metadataByType.set(
      classType,
      Object.assign({}, this.getMetadataByType(classType), { [keyName]: metadata })
    );
  }
}
