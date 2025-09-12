// utils/mockPayment.js
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

const SECRET = process.env.MOCK_PAYMENT_SECRET || "default_secret_for_dev";

export function createMockPayment({ amount, currency = "INR", receipt = null } = {}) {
  const paymentId = `mockpay_${uuidv4()}`;
  const orderId = `mockorder_${uuidv4()}`;
  const clientPayload = {
    paymentId,
    orderId,
    amount, // in rupees
    currency,
    receipt: receipt || `receipt_${uuidv4()}`,
  };

  // Signature created server side and also used for verification later.
  // In a real gateway, signature is provided by gateway to client → client returns it.
  const signature = signMock(clientPayload);

  // store minimal server-side record structure if you want (in-memory or DB) — this example returns it only
  return {
    clientPayload,
    signature,
  };
}

export function signMock(payload) {
  // payload should be deterministic string. Use JSON with sorted keys.
  const canonical = canonicalize(payload);
  return crypto.createHmac("sha256", SECRET).update(canonical).digest("hex");
}

export function verifyMockSignature(payload, signature) {
  const expected = signMock(payload);
  // Use constant-time compare
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

function canonicalize(obj) {
  // deterministic JSON with sorted keys
  return JSON.stringify(sortKeys(obj));
}

function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.keys(value).sort().reduce((acc, k) => {
      acc[k] = sortKeys(value[k]);
      return acc;
    }, {});
  }
  return value;
}
