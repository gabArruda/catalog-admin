import { ValueObject } from "./value-object";

class StringValueObject extends ValueObject {
  constructor(readonly prop: string) {
    super();
  }
}
class ComplexValueObject extends ValueObject {
  constructor(readonly prop: string, readonly prop2: number) {
    super();
  }
}

describe("ValueObject Unit Tests", () => {
  it("should return true for equal objects", () => {
    const stringValueObject1 = new StringValueObject("test");
    const stringValueObject2 = new StringValueObject("test");
    expect(stringValueObject1.equals(stringValueObject2)).toBeTruthy();

    const complexValueObject1 = new ComplexValueObject("test", 1);
    const complexValueObject2 = new ComplexValueObject("test", 1);
    expect(complexValueObject1.equals(complexValueObject2)).toBeTruthy();
  });

  it("should return false for different objects", () => {
    const stringValueObject1 = new StringValueObject("test");
    const stringValueObject2 = new StringValueObject("different test");
    expect(stringValueObject1.equals(stringValueObject2)).toBeFalsy();
    expect(stringValueObject1.equals(null as any)).toBeFalsy();
    expect(stringValueObject1.equals(undefined as any)).toBeFalsy();

    const complexValueObject1 = new ComplexValueObject("test", 1);
    const complexValueObject2 = new ComplexValueObject("different test", 1);
    const complexValueObject3 = new ComplexValueObject("test", 2);
    expect(complexValueObject1.equals(complexValueObject2)).toBeFalsy();
    expect(complexValueObject1.equals(complexValueObject3)).toBeFalsy();

    expect(stringValueObject1.equals(complexValueObject1)).toBeFalsy();
  });
});
