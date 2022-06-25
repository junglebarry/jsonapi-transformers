import { JsonapiEntity } from "..";
import { JsonapiEntityConstructorType } from "./utils";

export type MetadataByPropertyName<T> = { [attributeName: string]: T };

export type PropertyTypesForType<T> = Map<
  JsonapiEntityConstructorType<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  MetadataByPropertyName<T>
>;

export class MetadataMap<T> {
  private metadataByType = new Map<
    JsonapiEntityConstructorType<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    MetadataByPropertyName<T>
  >();

  getMetadataByType<E extends JsonapiEntity<E>>(
    classType: JsonapiEntityConstructorType<E>
  ): MetadataByPropertyName<T> {
    return this.metadataByType.get(classType) || {};
  }

  setMetadataByType<E extends JsonapiEntity<E>>(
    classType: JsonapiEntityConstructorType<E>,
    keyName: string,
    metadata: T
  ): void {
    this.metadataByType.set(
      classType,
      Object.assign({}, this.getMetadataByType(classType), {
        [keyName]: metadata,
      })
    );
  }
}
