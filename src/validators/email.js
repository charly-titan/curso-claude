/**
 * Validador de email.
 *
 * Estrategia: dos capas.
 *  1. `quickReject` — descarta entradas obviamente inválidas (longitud, espacios,
 *     @ duplicados, dominio/TLD vacíos, punto al inicio/fin de segmento, etc.).
 *  2. Regex anclada que valida el formato RFC 5322 simplificado.
 *
 * Filtra los 7 casos de "rechazo" y acepta los 3 casos "válidos" del issue #1.
 */

const MAX_EMAIL_LENGTH = 254; // RFC 5321
const LOCAL_MAX = 64;
const LABEL_MAX = 63;

function quickReject(email) {
  if (typeof email !== "string") return true;
  if (email.length === 0 || email.length > MAX_EMAIL_LENGTH) return true;
  if (email !== email.trim()) return true;                // espacios al inicio/fin
  if (email.includes(" ")) return true;                   // espacios internos
  if (email.indexOf("@") === -1) return true;             // sin @
  if (email.indexOf("@") !== email.lastIndexOf("@")) return true; // doble @@

  const [local, domain] = email.split("@");
  if (!local || local.length > LOCAL_MAX) return true;
  if (!domain || !domain.includes(".")) return true;      // sin TLD

  const labels = domain.split(".");
  for (const label of labels) {
    if (!label || label.length > LABEL_MAX) return true;  // etiqueta vacía
    if (label.startsWith("-") || label.endsWith("-")) return true;
  }

  // El TLD (última etiqueta) debe ser alfabético y >= 2 chars.
  const tld = labels[labels.length - 1];
  if (!/^[A-Za-z]{2,}$/.test(tld)) return true;

  // Local part no puede empezar/terminar en punto ni tener dos puntos seguidos.
  if (local.startsWith(".") || local.endsWith(".")) return true;
  if (local.includes("..")) return true;

  return false;
}

// RFC 5322 simplificado: local + @ + dominio con subdominios y TLD alfabético.
const EMAIL_REGEX =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

export function isValidEmail(email) {
  if (quickReject(email)) return false;
  return EMAIL_REGEX.test(email);
}
