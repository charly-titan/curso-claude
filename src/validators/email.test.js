import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidEmail } from "./email.js";

const INVALID = [
  "usuario@.com",            // dominio empieza con punto
  "usuario@com",             // sin TLD
  "@dominio.com",            // sin parte local
  "usuario@dominio.",        // TLD vacío
  "usuario@@dominio.com",    // doble @
  "usuario dominio.com",     // espacio
  "usuario@dominio .com",    // espacio en dominio
];

const VALID = [
  "usuario@dominio.com",
  "usuario.nombre+tag@sub.dominio.es",
  "usuario_123@dominio.io",
];

test("rechaza formatos inválidos del issue #1", () => {
  for (const email of INVALID) {
    assert.equal(isValidEmail(email), false, `debería rechazar: ${email}`);
  }
});

test("acepta formatos válidos del issue #1", () => {
  for (const email of VALID) {
    assert.equal(isValidEmail(email), true, `debería aceptar: ${email}`);
  }
});

test("edge cases", () => {
  assert.equal(isValidEmail(""), false);
  assert.equal(isValidEmail(null), false);
  assert.equal(isValidEmail(undefined), false);
  assert.equal(isValidEmail(123), false);
  assert.equal(isValidEmail("  usuario@dominio.com  "), false); // espacios al borde
  assert.equal(isValidEmail("a@b.co"), true);
  assert.equal(isValidEmail("a..b@dominio.com"), false);        // doble punto en local
});
