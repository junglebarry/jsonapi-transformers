import { attribute, entity, JsonapiEntity } from "../../src";

@entity({ type: "tags" })
export class Tag extends JsonapiEntity<Tag> {
  @attribute() label: string;
}
