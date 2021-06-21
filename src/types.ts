export interface ValidatingFunctionReturnType {
  error?: string;
}

export interface ValidateReturnType {
  valid: boolean;
  error?: string;
}

export type validatingFunction<T = unknown> = (
  item: T,
) => ValidatingFunctionReturnType;

export interface Validator<T = unknown> {
  validators: validatingFunction<T>[];
  field: string;
  isRequired: boolean;
  allowedValues?: T[];
  disallowedValues?: T[];

  allow: (...values: T[]) => unknown;
  disallow: (...values: T[]) => unknown;

  required: () => unknown;
  validate: (item?: T) => ValidateReturnType;
}

export interface StringValidatorURLFunctionOptions {
  /**
   * The schema/protocol that the URL should start with.
   * Example: `https`
   */
  scheme?: string;

  /**
   * Weather an authstring must be present in this url.
   * If true, this would be a valid url: `http://user:pass@example.com`
   */
  basicAuthRequired?: boolean;

  /**
   * Weather to check if the top-level domain (tld) is a valid domain name
   */
  verifyTlds?: boolean;
}

export interface StringValidatorEmailFunctionOptions {
  /**
   * The mail provider, including domain, of the email
   */
  mailProvider?: string | string[];

  /**
   * Weather to check if the top-level domain (tld) is a valid domain name
   */
  verifyTlds?: boolean;
}
