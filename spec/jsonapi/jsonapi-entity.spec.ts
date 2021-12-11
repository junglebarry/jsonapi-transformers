import { describe, expect, it } from "@jest/globals";
import { attribute, JsonapiEntity, meta, relationship } from "../../src";

describe("JsonapiEntity", () => {
  class FakeSimpleJsonapiEntity extends JsonapiEntity<FakeSimpleJsonapiEntity> {
    readonly type = "simples";
  }

  class FakeComplexJsonapiEntity extends JsonapiEntity<FakeComplexJsonapiEntity> {
    readonly type = "complexities";

    someNonJsonapiProperty: string;

    @attribute() someAttr: string;
    @attribute({ name: "some_other_attr" }) someOtherAttr: string;
    @meta() someMeta: string;
    @meta({ name: "some_other_meta" }) someOtherMeta: string;
    @relationship() someSimple: FakeSimpleJsonapiEntity;
    @relationship({ name: "some_other_simple" })
    someOtherSimple: FakeSimpleJsonapiEntity;
  }

  describe("construction should permit property specification for all properties", () => {
    it("should return true for a valid UnresolvedResourceIdentifier", () => {
      const fake = new FakeComplexJsonapiEntity({
        id: "complex1",
        someNonJsonapiProperty: "someNonJsonapiProperty!",
        someAttr: "someAttr!",
        someOtherAttr: "someOtherAttr!",
        someMeta: "someMeta!",
        someOtherMeta: "someOtherMeta!",
        someSimple: new FakeSimpleJsonapiEntity({ id: "simple1" }),
        someOtherSimple: new FakeSimpleJsonapiEntity({ id: "simple2" }),
      });
      expect(fake.id).toEqual("complex1");
      expect(fake.someNonJsonapiProperty).toEqual("someNonJsonapiProperty!");
      expect(fake.someAttr).toEqual("someAttr!");
      expect(fake.someOtherAttr).toEqual("someOtherAttr!");
      expect(fake.someMeta).toEqual("someMeta!");
      expect(fake.someOtherMeta).toEqual("someOtherMeta!");
      expect(fake.someSimple).toEqual(
        new FakeSimpleJsonapiEntity({ id: "simple1" })
      );
      expect(fake.someOtherSimple).toEqual(
        new FakeSimpleJsonapiEntity({ id: "simple2" })
      );
    });
  });
});
