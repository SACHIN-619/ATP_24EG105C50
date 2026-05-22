import { reduceStock } from './product.js';
import { getCartItems, getCartTotal, clearCart } from './cart.js';
import { applyDiscount } from './discount.js';

export function processPayment(paymentMethod, couponCode = null) {

  const items = getCartItems();
  const subtotal = getCartTotal();

  const discountResult = applyDiscount(subtotal, couponCode, items);

  if (!validatePaymentMethod(paymentMethod)) {
    return {
      status: "failed",
      message: "Invalid payment method"
    };
  }

  items.forEach(item => {
    reduceStock(item.productId, item.quantity);
  });

  clearCart();

  return {
    orderId: generateOrderId(),
    items: items,
    subtotal: subtotal,
    discount: discountResult.discount,
    total: discountResult.finalTotal,
    paymentMethod: paymentMethod,
    status: "success",
    message: "Order placed successfully"
  };
}

export function validatePaymentMethod(method) {
  return ["card", "upi", "cod"].includes(method);
}

function generateOrderId() {
  return "ORD" + Date.now();
}