import { describe, expect, it } from "@jest/globals";
import { link } from "../../src";

describe("link", () => {
  it("should throw an error", () => {
    const nonJsonapiEntity = () => link()(class extends Object {}, "foo");

    expect(nonJsonapiEntity).toThrow(
      "`@link` must only be applied to properties of `JsonapiEntity` subtypes"
    );
  });
});
