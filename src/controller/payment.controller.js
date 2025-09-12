// controllers/payment.controller.js
import { createMockPayment, verifyMockSignature } from "../utils/mockPayment.js";

/**
 * Create a mock payment (for testing)
 * Request body: { amount }
 * Response: { clientPayload, serverSignature }
 */
export const createMockPaymentController = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const { clientPayload, signature } = createMockPayment({ amount, currency: "INR" });

    // In a real payment flow:
    // - front-end receives clientPayload (paymentId, orderId, amount)
    // - it would open a checkout, then gateway returns a signature.
    // For our mock, we give the signature so you can test verify endpoint.
    return res.status(200).json({ success: true, clientPayload, serverSignature: signature });
  } catch (err) {
    console.error("createMockPayment error", err);
    return res.status(500).json({ success: false, message: "Failed to create mock payment" });
  }
};

/**
 * Verify mock payment signature (simulate gateway callback)
 * Body: { clientPayload, signature }
 * Returns success/failure.
 */
export const verifyMockPaymentController = async (req, res) => {
  try {
    const { clientPayload, signature } = req.body;
    if (!clientPayload || !signature) {
      return res.status(400).json({ success: false, message: "Missing payload or signature" });
    }

    const ok = verifyMockSignature(clientPayload, signature);
    if (!ok) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // In production you'd persist payment record or call order placement flow.
    return res.status(200).json({ success: true, message: "Payment verified", paymentId: clientPayload.paymentId, orderId: clientPayload.orderId });
  } catch (err) {
    console.error("verifyMockPayment error", err);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};
