import { describe, expect, it } from "@jest/globals";
import { attribute } from "../../src";

describe("attribute", () => {
  it("should throw an error", () => {
    const nonJsonapiEntity = () => attribute()(class extends Object {}, "foo");

    expect(nonJsonapiEntity).toThrow(
      "`@attribute` must only be applied to properties of `JsonapiEntity` subtypes"
    );
  });
});
