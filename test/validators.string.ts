import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { string, StringValidator } from "../src/validators/string.ts";

Deno.test({
  name: "StringValidator -> call string() function",
  fn() {
    const FIELD_NAME = "test1";
    const schema = string(FIELD_NAME);

    // Check if schema is an instance StringValidator
    assert(schema instanceof StringValidator);

    // Check for the field name
    assertEquals(schema.field, FIELD_NAME);
  },
});

Deno.test({
  name: "StringValidator -> check required()",
  fn() {
    const FIELD_NAME = "test2";
    const TEST_VALUE = "Hello, world";
    const schema = string(FIELD_NAME);

    schema.required();

    // Check if the isRequired field was set
    assert(schema.isRequired);

    // Validate the schema. Error should be present
    assert(!!schema.validate().error);

    // Validate the schema. Error should be absent
    assert(!schema.validate(TEST_VALUE).error);
  },
});

Deno.test({
  name: "StringValidator -> check allow(string)",
  fn() {
    const FIELD_NAME = "test3";
    const ALLOWED_VALUE = "Hello, world";
    const TEST_VALUE = ALLOWED_VALUE;
    const TEST_VALUE_2 = "Hi, world";
    const schema = string(FIELD_NAME);

    schema.allow(ALLOWED_VALUE);

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "StringValidator -> check disallow(string)",
  fn() {
    const FIELD_NAME = "test4";
    const DISALLOWED_VALUE = "Hello, world";
    const TEST_VALUE = DISALLOWED_VALUE;
    const TEST_VALUE_2 = "Hi, world";
    const schema = string(FIELD_NAME);

    schema.disallow(DISALLOWED_VALUE);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE).valid);

    // Validation should pass
    assert(schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "StringValidator -> check pattern(RegExp)",
  fn() {
    const FIELD_NAME = "test5";
    const REGEXP = /[abc]+/;
    const TEST_VALUE = "abccba";
    const TEST_VALUE_2 = "hello";
    const schema = string(FIELD_NAME);

    schema.pattern(REGEXP);

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "StringValidator -> check pattern(RegExp, {ignoreCase: true})",
  fn() {
    const FIELD_NAME = "test5";
    const REGEXP = /[abc]+/;
    const TEST_VALUE = "ABCCBA";
    const TEST_VALUE_2 = "hello";
    const schema = string(FIELD_NAME);

    schema.pattern(REGEXP, { ignoreCase: true });

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "StringValidator -> check pattern(RegExp, {ignoreCase: false})",
  fn() {
    const FIELD_NAME = "test5";
    const REGEXP = /[abc]+/i; // i provided to check if flag removal works
    const TEST_VALUE = "ABCCBA";
    const TEST_VALUE_2 = "hello";
    const schema = string(FIELD_NAME);

    schema.pattern(REGEXP, { ignoreCase: false });

    // Validation should fail
    assert(!schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "StringValidator -> check pattern(string)",
  fn() {
    const FIELD_NAME = "test5";
    const REGEXP = "[abc]+"; // i provided to check if flag removal works
    const TEST_VALUE = "abccba";
    const TEST_VALUE_2 = "hello";
    const schema = string(FIELD_NAME);

    schema.pattern(REGEXP);

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});
