export interface ValidatingFunctionReturnType {
  error?: string;
}

export interface ValidateReturnType {
  valid: boolean;
  error?: string;
}

export type validatingFunction<T = unknown> = (
  item: T
) => ValidatingFunctionReturnType;

export interface Validator<T = unknown> {
  validators: validatingFunction<T>[];
  field: string;
  isRequired: boolean;

  allow: (...values: T[]) => unknown;
  disallow: (...values: T[]) => unknown;

  required: () => unknown;
  validate: (item?: T) => ValidateReturnType;
}
