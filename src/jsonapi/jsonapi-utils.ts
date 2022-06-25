import { ResourceIdentifier, ResourceLinkage } from "./jsonapi-types";

export function jsonapiIdentifier(
  target: ResourceIdentifier
): ResourceIdentifier {
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
