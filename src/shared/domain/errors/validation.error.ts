import { FieldsErrors } from "../validators/validator-fields.interface";

export class EntityValidationError extends Error {
  constructor(
    public error: FieldsErrors[],
    message = "Entity Validation Error"
  ) {
    super(message);
    this.name = "EntityValidationError";
  }

  count() {
    return Object.keys(this.error).length;
  }
}
