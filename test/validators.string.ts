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
    const FIELD_NAME = "test6";
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
    const FIELD_NAME = "test7";
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
    const FIELD_NAME = "test8";
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

Deno.test({
  name: "StringValidator -> check alpha()",
  fn() {
    const FIELD_NAME = "test9";
    const TEST_VALUE = "abccba";
    const TEST_VALUE_2 = "a123";
    const schema = string(FIELD_NAME);

    schema.alpha();

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "StringValidator -> check numeric()",
  fn() {
    const FIELD_NAME = "test10";
    const TEST_VALUE = "1230391";
    const TEST_VALUE_2 = "asdas";
    const schema = string(FIELD_NAME);

    schema.numeric();

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "StringValidator -> check alpha()",
  fn() {
    const FIELD_NAME = "test11";
    const TEST_VALUE = "abccba";
    const TEST_VALUE_2 = "a123";
    const schema = string(FIELD_NAME);

    schema.alpha();

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "StringValidator -> check alnum()",
  fn() {
    const FIELD_NAME = "test12";
    const TEST_VALUE = "12asd303fe91";
    const TEST_VALUE_2 = "Hello, world";
    const schema = string(FIELD_NAME);

    schema.alnum();

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "StringValidator -> check url()",
  fn() {
    const FIELD_NAME = "test13";
    const TEST_VALUE = "https://example.org";
    const TEST_VALUE_2 = "urlwithoutscheme.com";
    const schema = string(FIELD_NAME);

    schema.url();

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "StringValidator -> check url({basicAuthRequired: true})",
  fn() {
    const FIELD_NAME = "test14";
    const TEST_VALUE = "https://test:user@hello.com";
    const TEST_VALUE_2 = "https://example.org";
    const schema = string(FIELD_NAME);

    schema.url({ basicAuthRequired: true });

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "StringValidator -> check url({scheme: string})",
  fn() {
    const FIELD_NAME = "test15";
    const TEST_VALUE = "postgres://server.com";
    const TEST_VALUE_2 = "https://example.org";
    const schema = string(FIELD_NAME);

    schema.url({ scheme: "postgres" });

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "StringValidator -> check email()",
  fn() {
    const FIELD_NAME = "test16";
    const TEST_VALUE = "test@example.org";
    const TEST_VALUE_2 = "https://example.org";
    const schema = string(FIELD_NAME);

    schema.email();

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "StringValidator -> check email({mailProvider: string})",
  fn() {
    const FIELD_NAME = "test17";
    const TEST_VALUE = "test@example.org";
    const TEST_VALUE_2 = "test@test.com";
    const schema = string(FIELD_NAME);

    schema.email({ mailProvider: "example.org" });

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "StringValidator -> check email({verifyTlds: boolean})",
  fn() {
    const FIELD_NAME = "test18";
    const TEST_VALUE = "test@example.org";
    const TEST_VALUE_2 = "test@example.invalidtlds";
    const schema = string(FIELD_NAME);

    schema.email({ verifyTlds: true });

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});
