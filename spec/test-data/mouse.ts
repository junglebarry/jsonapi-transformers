import { entity } from "../../src";

import { Animal } from "./animal";

@entity({ type: "mice" })
export class Mouse extends Animal {}
