import { describe, expect, it } from "@jest/globals";
import { meta } from "../../src";

describe("meta", () => {
  it("should throw an error", () => {
    const nonJsonapiEntity = () => meta()(class extends Object {}, "foo");

    expect(nonJsonapiEntity).toThrow(
      "`@meta` must only be applied to properties of `JsonapiEntity` subtypes"
    );
  });
});
