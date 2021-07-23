import { attribute, entity, link, meta, relationship } from "../../src";

import { Animal } from "./animal";
import { Person } from "./person";

export type CatLivesLeft = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

@entity({ type: "cats" })
export class Cat extends Animal {
  @attribute({ name: "lives_left" }) livesLeft: CatLivesLeft;
  @link({ name: "alt" }) alternative: string;
  @meta({ name: "alter_ego" }) alterEgo: string;
  @relationship({ name: "owner" }) petOwner: Person;
}
