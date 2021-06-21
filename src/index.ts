import type { validatingFunction, ValidateReturnType } from "./types.ts";

interface Field {
  validate: validatingFunction;
  field: string;
  isRequired: boolean;
  // Any other fields it may have
  [key: string]: unknown;
}

export class Schema {
  fields: Field[];

  constructor(...fields: Field[]) {
    this.fields = fields;
  }

  validate(payload: Record<string, unknown>): ValidateReturnType {
    for (const field of this.fields) {
      const p = payload[field.field]
      if (field.isRequired && !p) return {valid: false, error: `"${field.field}" is a required field`};
      if (p) {
        const {error} = field.validate(p);
        if (error) return {valid: false, error}
      }
    }
    return {valid: true}
  }
}
