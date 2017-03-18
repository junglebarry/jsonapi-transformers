
export interface ResourceIdentifier {
  id: string;
  type: string;
}

export type AttributesObject = { [attributeName: string]: any };

export type ResourceLinkage = null | ResourceIdentifier | ResourceIdentifier[];

export interface RelationshipsObject {
  data?: ResourceLinkage;
}

export interface ResourceObject extends ResourceIdentifier {
  attributes?: AttributesObject;
  relationships?: { [relationshipName: string]: RelationshipsObject };
}

export class JsonapiEntity implements ResourceIdentifier {
  id: string;
  type: string;
}

export function jsonapiIdentifier(target: ResourceIdentifier): ResourceIdentifier {
  const { id, type } = target;
  return { id, type };
}

export function jsonapiLinkage(linkage: ResourceLinkage): ResourceLinkage {
  if (Array.isArray(linkage)) {
    return linkage.map(jsonapiIdentifier);
  } else if (linkage) {
    return jsonapiIdentifier(linkage);
  } else if (linkage === null) {
    return null;
  }

  return undefined;
}

export type PrimaryData = ResourceObject | ResourceObject[];

export interface TopLevelData {
  data: PrimaryData;
  included?: ResourceObject[];
}

export type TopLevel = TopLevelData;

