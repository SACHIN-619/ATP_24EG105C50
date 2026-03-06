const coupons = {
  'WELCOME10': { type: 'percentage', value: 10, minAmount: 1000 },
  'FLAT500': { type: 'flat', value: 500, minAmount: 5000 },
  'ELECTRONICS20': { type: 'percentage', value: 20, minAmount: 10000, category: 'electronics' }
};

export function validateCoupon(code, cartTotal) {

  const coupon = coupons[code];

  if (!coupon)
    return { valid: false, message: "Invalid coupon" };

  if (cartTotal < coupon.minAmount)
    return { valid: false, message: "Minimum amount not reached" };

  return { valid: true, message: "Coupon applied" };
}

export function calculateDiscount(code, cartTotal) {

  const coupon = coupons[code];

  if (coupon.type === "percentage")
    return cartTotal * coupon.value / 100;

  if (coupon.type === "flat")
    return coupon.value;

  return 0;
}

export function applyDiscount(cartTotal, code, cartItems) {

  if (!code)
    return {
      originalTotal: cartTotal,
      discount: 0,
      finalTotal: cartTotal,
      message: "No coupon"
    };

  const result = validateCoupon(code, cartTotal);

  if (!result.valid)
    return {
      originalTotal: cartTotal,
      discount: 0,
      finalTotal: cartTotal,
      message: result.message
    };

  const discount = calculateDiscount(code, cartTotal);

  return {
    originalTotal: cartTotal,
    discount: discount,
    finalTotal: cartTotal - discount,
    message: "Discount applied"
  };
}