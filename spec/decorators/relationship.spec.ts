import { describe, expect, it } from "@jest/globals";
import { relationship } from "../../src";

describe("relationship", () => {
  it("should throw an error", () => {
    const nonJsonapiEntity = () =>
      relationship()(class extends Object {}, "foo");

    expect(nonJsonapiEntity).toThrow(
      "`@relationship` must only be applied to properties of `JsonapiEntity` subtypes"
    );
  });
});
