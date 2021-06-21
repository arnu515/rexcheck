import type { ValidateReturnType, validatingFunction } from "./types.ts";

interface Field {
  validate: validatingFunction;
  field: string;
  isRequired: boolean;
  // Any other fields it may have
  [key: string]: unknown;
}

/**
 * Creates a new Rexcheck schema.
 * Specify new fields as parameters.
 *
 * Examples:
 * ```typescript
 * // Create new schema
 * const schema = new Schema(
 *   // Create a new string() field
 *   // Chain methods to validate fields
 *   string(field_name).required().min(4).alpha(),
 *
 *   // Add another field, this time a number() field
 *   number(field_name).required().integer()
 * )
 * ```
 */
export class Schema {
  /** The fields of the schema. Not meant for public use, but we keep it public anyway. */
  fields: Field[];

  // deno-lint-ignore no-explicit-any
  constructor(...fields: any[]) {
    this.fields = fields;
  }

  /**
   * Validates the schema.
   * @param payload An object to validate the schema against
   */
  validate(payload: Record<string, unknown>): ValidateReturnType {
    for (const field of this.fields) {
      const p = payload[field.field];
      if (field.isRequired && !p) {
        return { valid: false, error: `"${field.field}" is a required field` };
      }
      if (p) {
        const { error } = field.validate(p);
        if (error) return { valid: false, error };
      }
    }
    return { valid: true };
  }
}
