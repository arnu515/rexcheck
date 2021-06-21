import type { validatingFunction, Validator } from "../types.ts";

const typeValidator = (field: string): validatingFunction => {
  return (item) => {
    if (typeof item !== "number") return { error: `${field} is not a number` };
    return {};
  };
};

export class NumberValidator implements Validator<number> {
  field: string;
  isRequired: boolean;
  validators: validatingFunction<number>[];
  allowedValues?: number[];
  disallowedValues?: number[];

  constructor(field: string) {
    this.field = field;
    this.validators = [typeValidator(this.field)];
    this.isRequired = false;
  }

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

  public required() {
    this.isRequired = true;
    return this;
  }

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

  public integer() {
    this.validators.push((item) => {
      if (!Number.isInteger(item)) {
        return { error: `"${this.field}" should be an integer` };
      } else return {};
    });

    return this;
  }

  public negative() {
    this.validators.push((item) => {
      if (item >= 0) return { error: `"${this.field}" should be negative` };
      else return {};
    });
  }

  public positive() {
    this.validators.push((item) => {
      if (item <= 0) return { error: `"${this.field}" should be positive` };
      else return {};
    });
  }

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
