import { assert } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { Schema } from "../src/index.ts";
import { number } from "../src/validators/number.ts";
import { string } from "../src/validators/string.ts";

Deno.test({
  name: "Schema -> basic test",
  fn() {
    const schema = new Schema(
      string("username").alnum().required(),
      string("password").alnum().required(),
      number("age").min(18),
    );
    assert(
      schema.validate({ username: "test12", password: "test123", age: 20 })
        .valid,
    );
    assert(!schema.validate({}).valid);
    assert(!schema.validate({ username: "test" }).valid);
    assert(!schema.validate({ password: "test" }).valid);
    assert(!schema.validate({ age: 12 }).valid);
    assert(schema.validate({ username: "test", password: "test" }).valid);
  },
});
