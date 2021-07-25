import {
  attribute,
  entity,
  meta,
  relationship,
  JsonapiEntity,
  link,
} from "../../src";
import { Author } from "./author";
import { Tag } from "./tag";

@entity({ type: "blog_posts" })
export class BlogPost extends JsonapiEntity {
  @meta() createdDateTime: string;
  @attribute() title: string;
  @attribute() content: string;
  @link() self: string;
  @relationship() author: Author;
  @relationship() tags: Tag[];
}
