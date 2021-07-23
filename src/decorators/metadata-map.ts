export type MetadataByPropertyName<T> = { [attributeName: string]: T };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PropertyTypesForType<T> = Map<any, MetadataByPropertyName<T>>;

export class MetadataMap<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private metadataByType = new Map<any, MetadataByPropertyName<T>>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  getMetadataByType(classType: any): MetadataByPropertyName<T> {
    return this.metadataByType.get(classType) || {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  setMetadataByType(classType: any, keyName: string, metadata: T): void {
    this.metadataByType.set(
      classType,
      Object.assign({}, this.getMetadataByType(classType), {
        [keyName]: metadata,
      })
    );
  }
}
