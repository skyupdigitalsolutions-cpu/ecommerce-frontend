// Loads Razorpay's Checkout script once and opens the payment popup.
// The keys/order come from your backend's POST /api/payments/create-order.

let loaded = false;

const loadScript = () =>
  new Promise((resolve, reject) => {
    if (loaded || window.Razorpay) {
      loaded = true;
      return resolve();
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => {
      loaded = true;
      resolve();
    };
    s.onerror = () => reject(new Error("Failed to load Razorpay Checkout"));
    document.body.appendChild(s);
  });

// opts: { key, razorpayOrderId, amount, currency, name, email, contact }
// Resolves with { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// or rejects if the user dismisses the popup.
export const openRazorpay = async (opts) => {
  await loadScript();
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: opts.key,
      order_id: opts.razorpayOrderId,
      amount: opts.amount,
      currency: opts.currency || "INR",
      name: "Impression",
      description: "Order payment",
      prefill: { name: opts.name, email: opts.email, contact: opts.contact },
      theme: { color: "#2340e6" },
      handler: (response) => resolve(response),
      modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
    });
    rzp.on("payment.failed", (resp) =>
      reject(new Error(resp?.error?.description || "Payment failed"))
    );
    rzp.open();
  });
};
