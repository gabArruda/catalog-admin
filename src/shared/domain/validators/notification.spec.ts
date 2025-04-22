import { Notification } from "./notification";

describe("Notification Unit Tests", () => {
  let notification: Notification;

  beforeEach(() => {
    notification = new Notification();
  });

  it("should add an error to a specific field", () => {
    notification.addError("must be valid", "email");

    expect(notification.errors.get("email")).toEqual(["must be valid"]);
  });

  it("should not add duplicate error for the same field", () => {
    notification.addError("required", "name");
    notification.addError("required", "name");

    expect(notification.errors.get("name")).toEqual(["required"]);
  });

  it("should add global error (no field)", () => {
    notification.addError("Something went wrong");

    expect(notification.errors.get("Something went wrong")).toBe(
      "Something went wrong"
    );
  });

  it("should set error(s) on a field and overwrite previous", () => {
    notification.addError("Old error", "name");
    notification.setError("New error", "name");

    expect(notification.errors.get("name")).toEqual(["New error"]);
  });

  it("should set multiple errors on a field", () => {
    notification.setError(["Error 1", "Error 2"], "password");

    expect(notification.errors.get("password")).toEqual(["Error 1", "Error 2"]);
  });

  it("should set multiple global errors", () => {
    notification.setError(["Error A", "Error B"]);

    expect(notification.errors.get("Error A")).toBe("Error A");
    expect(notification.errors.get("Error B")).toBe("Error B");
  });

  it("should detect if it has errors", () => {
    expect(notification.hasErrors()).toBe(false);

    notification.addError("Missing value", "field");

    expect(notification.hasErrors()).toBe(true);
  });

  it("should copy errors from another notification", () => {
    const other = new Notification();
    other.addError("must be valid", "email");
    other.setError("required", "name");

    notification.copyErrors(other);

    expect(notification.errors.get("email")).toEqual(["must be valid"]);
    expect(notification.errors.get("name")).toEqual(["required"]);
  });

  it("should serialize to JSON correctly", () => {
    notification.addError("invalid", "email");
    notification.addError("Something is wrong");

    const json = notification.toJSON();

    expect(json).toEqual([{ email: ["invalid"] }, "Something is wrong"]);
  });
});
