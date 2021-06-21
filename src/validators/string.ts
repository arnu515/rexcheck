import type {
  StringValidatorEmailFunctionOptions,
  StringValidatorURLFunctionOptions,
  validatingFunction,
  Validator,
} from "../types.ts";
import tlds from "../tld.ts";

const typeValidator = (field: string): validatingFunction => {
  return (item) => {
    if (typeof item !== "string") return { error: `${field} is not a string` };
    return {};
  };
};

/**
 * Validator for string fields.
 */
export class StringValidator implements Validator<string> {
  /** The validator functions that're called upon calling the validate() function */
  validators: validatingFunction<string>[];

  /** The name of the field */
  field: string;

  /** Weather the field is required or not */
  isRequired: boolean;

  /** A list of the allowed values allowed using the allow() function */
  allowedValues?: string[];

  /** A list of the disallowed values disallowed using the disallow() function */
  disallowedValues?: string[];

  constructor(field: string) {
    this.field = field;
    this.validators = [typeValidator(this.field)];
    this.isRequired = false;
  }

  /** Let `value` be a valid value of the field */
  public allow(...values: string[]) {
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
  public disallow(...values: string[]) {
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

  /** The value must be atleast `length` characters long */
  public min(length: number) {
    this.validators.push((item) => {
      if (item.length < length) {
        return {
          error: `"${this.field}" should be atleast ${length} characters long`,
        };
      }
      return {};
    });
    return this;
  }

  /** The value must not be more than `length` characters long */
  public max(length: number) {
    this.validators.push((item) => {
      if (item.length > length) {
        return {
          error: `"${this.field}" should not be more ${length} characters long`,
        };
      }
      return {};
    });
    return this;
  }

  /** The value must only contain alphabetic characters */
  public alpha() {
    this.pattern(/^[a-z]+$/, { ignoreCase: true });

    return this;
  }

  /** The value must only contain numeric characters */
  public numeric() {
    this.pattern(/^\d+$/, { ignoreCase: true });

    return this;
  }

  /** The value must only contain alphanumeric characters */
  public alnum() {
    this.pattern(/^[a-z\d]+$/, { ignoreCase: true });

    return this;
  }

  /** The value must be a valid uuid */
  public uuid() {
    this.pattern(
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
      { ignoreCase: false },
    );

    return this;
  }

  /**
   * The value must be a valid URL
   */
  public url(opts?: StringValidatorURLFunctionOptions) {
    const { basicAuthRequired = false, scheme, verifyTlds = true } = opts ?? {};

    this.validators.push((item) => {
      // check valid url
      if (!/[\w]+:\/\/[\w]{0,}:{0,}[\w]{0,}@?[\w]+:?[\d]{0,}/.test(item)) {
        return { error: `${this.field} is not a URL` };
      }

      // Check scheme/protocol
      if (!new RegExp(`^${scheme || "[\\w]+"}:\/\/`, "i").test(item)) {
        return {
          error: scheme
            ? `"${this.field}" should start with "${scheme}://"`
            : `"${this.field}" should have a valid scheme.`,
        };
      }
      const urlWithoutScheme = item.replace(
        new RegExp(`^${scheme || "[\\w]+"}:\/\/`, "i"),
        "",
      );
      const urlWithoutPath = urlWithoutScheme.replace(/\/.+$/, "");
      const urlSplit = urlWithoutPath.split("@");
      if (urlSplit.length < 1) return { error: `${item} is not a valid URL` };
      if (basicAuthRequired && urlSplit.length !== 2) {
        return { error: `${this.field} needs an auth string` };
      }

      if (verifyTlds) {
        const url = urlSplit[urlSplit.length - 1];
        const [host] = url.split(":");
        const tld = host.split(".")[host.split(".").length - 1];
        if (!tlds.includes(tld.toUpperCase())) {
          return {
            error: `${this.field} does not have a valid top-level domain name`,
          };
        }
      }

      return {};
    });

    return this;
  }

  /** The value must be a valid email */
  public email(opts?: StringValidatorEmailFunctionOptions) {
    this.validators.push((item) => {
      if (!/[\w\.\_\+]+@[\w\.\_]+\.[\w]+/.test(item)) {
        return { error: `"${this.field}" is not an email` };
      }
      if (opts?.verifyTlds) {
        const tld = item.split(".")[item.split(".").length - 1];
        if (!tlds.includes(tld.toUpperCase())) {
          return {
            error: `${this.field} does not have a valid top-level domain name`,
          };
        }
      }
      if (opts?.mailProvider) {
        const mailProvider = item.split("@")[item.split("@").length - 1];
        if (opts?.mailProvider !== mailProvider) {
          return {
            error: `${this.field} should be an email address from ${opts
              ?.mailProvider}`,
          };
        }
      }

      return {};
    });

    return this;
  }

  /** The value must match the regular expression `regex`.
   * Note: All flags are removed. To ignore case, use the `{ignoreCase}` option.
   */
  public pattern(regex: RegExp | string, opts: { ignoreCase?: boolean } = {}) {
    const flags = opts?.ignoreCase ? "i" : "";
    const re = new RegExp(regex, flags);

    this.validators.push((item) => {
      if (!re.test(item)) {
        return { error: `"${this.field}" does not satisfy regex "${re}"` };
      }
      return {};
    });

    return this;
  }

  /**
   * Validates `item` against the field
   * @param item The item to validate
   * @returns An object with an optional `error` property
   */
  // deno-lint-ignore no-explicit-any
  public validate(item?: any) {
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

export function string(field: string) {
  return new StringValidator(field);
}
