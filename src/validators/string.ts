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

export class StringValidator implements Validator<string> {
  validators: validatingFunction<string>[];
  field: string;
  isRequired: boolean;
  allowedValues?: string[];
  disallowedValues?: string[];

  constructor(field: string) {
    this.field = field;
    this.validators = [typeValidator(this.field)];
    this.isRequired = false;
  }

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

  public required() {
    this.isRequired = true;
    return this;
  }

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

  public alpha() {
    this.pattern(/^[a-z]+$/, { ignoreCase: true });

    return this;
  }

  public numeric() {
    this.pattern(/^\d+$/, { ignoreCase: true });

    return this;
  }

  public alnum() {
    this.pattern(/^[a-z\d]+$/, { ignoreCase: true });

    return this;
  }

  public uuid() {
    this.pattern(
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
      { ignoreCase: false }
    );

    return this;
  }

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
        ""
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
            error: `${this.field} should be an email address from ${opts?.mailProvider}`,
          };
        }
      }

      return {};
    });

    return this;
  }

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
