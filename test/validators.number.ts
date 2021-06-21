import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { number, NumberValidator } from "../src/validators/number.ts";

Deno.test({
  name: "NumberValidator -> check for correct type",
  fn() {
    const FIELD_NAME = "test";
    const TEST_VALUE = "str";
    const TEST_VALUE_2 = false;
    const TEST_VALUE_3 = null;
    const TEST_VALUE_4 = undefined;
    const TEST_VALUE_5 = 1;
    const schema = number(FIELD_NAME);

    // Should fail
    assert(!schema.validate(TEST_VALUE).valid);
    assert(!schema.validate(TEST_VALUE_2).valid);
    assert(!schema.validate(TEST_VALUE_3).valid);

    // Should pass
    assert(schema.validate(TEST_VALUE_4).valid);

    schema.required();
    // Should now fail
    assert(!schema.validate(TEST_VALUE_4).valid);

    // Should pass
    assert(schema.validate(TEST_VALUE_5).valid);
  },
});

Deno.test({
  name: "NumberValidator -> call string() function",
  fn() {
    const FIELD_NAME = "test1";
    const schema = number(FIELD_NAME);

    // Check if schema is an instance StringValidator
    assert(schema instanceof NumberValidator);

    // Check for the field name
    assertEquals(schema.field, FIELD_NAME);
  },
});

Deno.test({
  name: "NumberValidator -> check required()",
  fn() {
    const FIELD_NAME = "test2";
    const TEST_VALUE = 5;
    const schema = number(FIELD_NAME);

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
  name: "NumberValidator -> check allow(number)",
  fn() {
    const FIELD_NAME = "test3";
    const ALLOWED_VALUE = 5;
    const TEST_VALUE = ALLOWED_VALUE;
    const TEST_VALUE_2 = 10;
    const schema = number(FIELD_NAME);

    schema.allow(ALLOWED_VALUE);

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "NumberValidator -> check disallow(number)",
  fn() {
    const FIELD_NAME = "test4";
    const DISALLOWED_VALUE = 10;
    const TEST_VALUE = DISALLOWED_VALUE;
    const TEST_VALUE_2 = 5;
    const schema = number(FIELD_NAME);

    schema.disallow(DISALLOWED_VALUE);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE).valid);

    // Validation should pass
    assert(schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "NumberValidator -> check max(number)",
  fn() {
    const FIELD_NAME = "test5";
    const TEST_VALUE = 5;
    const TEST_VALUE_2 = 10;
    const MAX_VALUE = 5;
    const schema = number(FIELD_NAME);

    schema.max(MAX_VALUE);

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "NumberValidator -> check min(number)",
  fn() {
    const FIELD_NAME = "test6";
    const TEST_VALUE = 5;
    const TEST_VALUE_2 = 3;
    const MIN_VALUE = 5;
    const schema = number(FIELD_NAME);

    schema.min(MIN_VALUE);

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "NumberValidator -> check integer()",
  fn() {
    const FIELD_NAME = "test7";
    const TEST_VALUE = 5;
    const TEST_VALUE_2 = 3.5;
    const schema = number(FIELD_NAME);

    schema.integer();

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "NumberValidator -> check positive()",
  fn() {
    const FIELD_NAME = "test8";
    const TEST_VALUE = 5;
    const TEST_VALUE_2 = -3;
    const schema = number(FIELD_NAME);

    schema.positive();

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});

Deno.test({
  name: "NumberValidator -> check negative()",
  fn() {
    const FIELD_NAME = "test8";
    const TEST_VALUE = -5;
    const TEST_VALUE_2 = 3;
    const schema = number(FIELD_NAME);

    schema.negative();

    // Validation should pass
    assert(schema.validate(TEST_VALUE).valid);

    // Validation should fail
    assert(!schema.validate(TEST_VALUE_2).valid);
  },
});
