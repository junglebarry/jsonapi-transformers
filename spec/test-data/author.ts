import { attribute, entity, meta, JsonapiEntity } from "../../src";

@entity({ type: "authors" })
export class Author extends JsonapiEntity<Author> {
  @meta() lastLoginDateTime: string;
  @attribute() name: string;
}
