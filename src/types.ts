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
  scheme?: string;
  basicAuthRequired?: boolean;
  verifyTlds?: boolean;
}

export interface StringValidatorEmailFunctionOptions {
  mailProvider?: string | string[];
  verifyTlds?: boolean;
}
