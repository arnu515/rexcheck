import type { validatingFunction, Validator } from "../types.ts";

const typeValidator = (field: string): validatingFunction => {
  return (item) => {
    if (typeof item !== "number") return { error: `${field} is not a number` };
    return {};
  };
};

/**
 * Validator for number (int and float) fields.
 */
export class NumberValidator implements Validator<number> {
  /** The validator functions that're called upon calling the validate() function */
  validators: validatingFunction<number>[];

  /** The name of the field */
  field: string;

  /** Weather the field is required or not */
  isRequired: boolean;

  /** A list of the allowed values allowed using the allow() function */
  allowedValues?: number[];

  /** A list of the disallowed values disallowed using the disallow() function */
  disallowedValues?: number[];

  constructor(field: string) {
    this.field = field;
    this.validators = [typeValidator(this.field)];
    this.isRequired = false;
  }

  /** Let `value` be a valid value of the field */
  public allow(...values: number[]) {
    if (!this.allowedValues) this.allowedValues = [];
    this.allowedValues = this.allowedValues.concat(values);

    this.validators.push((item) => {
      if (!this.allowedValues) return {};
      if (!this.allowedValues.includes(item)) {
        return {
          error: `"${item}" is not allowed to be a value of "${this.field}"`,
        };
      }
      return {};
    });

    return this;
  }

  /** Don't allow `value` to be a valid value of the field */
  public disallow(...values: number[]) {
    if (!this.disallowedValues) this.disallowedValues = [];
    this.disallowedValues = this.disallowedValues.concat(values);

    this.validators.push((item) => {
      if (!this.disallowedValues) return {};
      if (this.disallowedValues.includes(item)) {
        return {
          error: `"${item}" is not allowed to be a value of "${this.field}"`,
        };
      }
      return {};
    });

    return this;
  }

  /** A value must be given for this field */
  public required() {
    this.isRequired = true;
    return this;
  }

  /** The value must be greater than or equal to `length` */
  public min(length: number) {
    this.validators.push((item) => {
      if (item < length) {
        return {
          error: `"${this.field}" should be atleast ${length} characters long`,
        };
      }
      return {};
    });
    return this;
  }

  /** The value must be lesser than or equal to `length` */
  public max(length: number) {
    this.validators.push((item) => {
      if (item > length) {
        return {
          error: `"${this.field}" should not be more ${length} characters long`,
        };
      }
      return {};
    });
    return this;
  }

  /** The value must be a non-decimal integer */
  public integer() {
    this.validators.push((item) => {
      if (!Number.isInteger(item)) {
        return { error: `"${this.field}" should be an integer` };
      } else return {};
    });

    return this;
  }

  /** The value must be a negative number */
  public negative() {
    this.validators.push((item) => {
      if (item >= 0) return { error: `"${this.field}" should be negative` };
      else return {};
    });
  }

  /** The value must be a positive number */
  public positive() {
    this.validators.push((item) => {
      if (item <= 0) return { error: `"${this.field}" should be positive` };
      else return {};
    });
  }

  /**
   * Validates `item` against the field
   * @param item The item to validate
   * @returns An object with an optional `error` property
   */
  // deno-lint-ignore no-explicit-any
  validate(item?: any) {
    if (typeof item === "undefined") {
      if (this.isRequired) {
        return { valid: false, error: `"${this.field}" is required` };
      } else return { valid: true };
    }
    for (const validator of this.validators) {
      const { error } = validator(item);
      if (error) {
        return { valid: false, error };
      }
    }
    return { valid: true };
  }
}

export function number(field: string) {
  return new NumberValidator(field);
}
