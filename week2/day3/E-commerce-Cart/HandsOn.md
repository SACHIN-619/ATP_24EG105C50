Assignment 2: 
-------------
E-Commerce Shopping Cart System :
      Building a shopping cart like Amazon or Flipkart

Requirements:
      Create a modular shopping system with 5 files:

           i. product.js - Product catalog
                          // Product database (simulated)
                          const products = [
                            { id: 1, name: 'Laptop', price: 50000, stock: 10, category: 'electronics' },
                            { id: 2, name: 'Phone', price: 30000, stock: 15, category: 'electronics' },
                            { id: 3, name: 'Headphones', price: 2000, stock: 25, category: 'accessories' },
                            { id: 4, name: 'Mouse', price: 500, stock: 50, category: 'accessories' },
                            { id: 5, name: 'Keyboard', price: 1500, stock: 30, category: 'accessories' }
                          ];
                          
                          // TODO: Implement these functions
                          
                          export function getProductById(id) {
                            // Find and return product by ID
                          }
                          
                          export function getAllProducts() {
                            // Return all products
                          }
                          
                          export function getProductsByCategory(category) {
                            // Filter products by category
                          }
                          
                          export function searchProducts(query) {
                            // Search products by name (case-insensitive)
                          }
                          
                          export function checkStock(productId, quantity) {
                            // Check if product has enough stock
                            // Return true/false
                          }
                          
                          export function reduceStock(productId, quantity) {
                            // Reduce product stock after purchase
                          }




          ii. cart.js - Shopping cart operations
                          import { getProductById, checkStock } from './product.js';
                          
                          let cartItems = [];
                          
                          // TODO: Implement these functions
                          
                          export function addToCart(productId, quantity) {
                            // 1. Get product details
                            // 2. Check stock availability
                            // 3. Check if product already in cart
                            //    - If yes, update quantity
                            //    - If no, add new item
                            // 4. Return success/error message
                          }
                          
                          export function removeFromCart(productId) {
                            // Remove product from cart
                          }
                          
                          export function updateQuantity(productId, newQuantity) {
                            // Update quantity of product in cart
                            // Check stock before updating
                          }
                          
                          export function getCartItems() {
                            // Return all cart items with product details
                          }
                          
                          export function getCartTotal() {
                            // Calculate total price of all items in cart
                            // Return total
                          }
                          
                          export function clearCart() {
                            // Empty the cart
                          }


          iii. discount.js - Coupon and discount logic
                          // Available coupons
                          const coupons = {
                            'WELCOME10': { type: 'percentage', value: 10, minAmount: 1000 },
                            'FLAT500': { type: 'flat', value: 500, minAmount: 5000 },
                            'ELECTRONICS20': { type: 'percentage', value: 20, minAmount: 10000, category: 'electronics' }
                          };
                          
                          // TODO: Implement these functions
                          
                          export function validateCoupon(couponCode, cartTotal, cartItems) {
                            // 1. Check if coupon exists
                            // 2. Check minimum amount requirement
                            // 3. Check category requirement (if any)
                            // Return { valid: true/false, message: '...' }
                          }
                          
                          export function calculateDiscount(couponCode, cartTotal) {
                            // Calculate discount amount based on coupon type
                            // Return discount amount
                          }
                          
                          export function applyDiscount(cartTotal, couponCode, cartItems) {
                            // 1. Validate coupon
                            // 2. If valid, calculate discount
                            // 3. Return final amount and discount details
                            // Return { 
                            //   originalTotal: ..., 
                            //   discount: ..., 
                            //   finalTotal: ...,
                            //   message: '...'
                            // }
                          }



          iv. payment.js - Payment processing
                          import { reduceStock } from './product.js';
                          import { getCartItems, getCartTotal, clearCart } from './cart.js';
                          import { applyDiscount } from './discount.js';
                          
                          // TODO: Implement these functions
                          
                          export function processPayment(paymentMethod, couponCode = null) {
                            // 1. Get cart items and total
                            // 2. Apply discount if coupon provided
                            // 3. Validate payment method (card/upi/cod)
                            // 4. Process payment (simulate)
                            // 5. Reduce stock for all items
                            // 6. Clear cart
                            // 7. Generate order summary
                            
                            // Return order summary:
                            // {
                            //   orderId: ...,
                            //   items: [...],
                            //   subtotal: ...,
                            //   discount: ...,
                            //   total: ...,
                            //   paymentMethod: ...,
                            //   status: 'success/failed',
                            //   message: '...'
                            // }
                          }
                          
                          export function validatePaymentMethod(method) {
                            // Check if method is valid (card/upi/cod)
                          }
                          
                          function generateOrderId() {
                            // Generate random order ID
                            return 'ORD' + Date.now();
                          }



          v. app.js - Main application
                        import { 
                          getAllProducts, 
                          searchProducts, 
                          getProductsByCategory 
                        } from './product.js';
                        
                        import { 
                          addToCart, 
                          getCartItems, 
                          getCartTotal, 
                          updateQuantity,
                          removeFromCart 
                        } from './cart.js';
                        
                        import { processPayment } from './payment.js';
                        
                        console.log('=== E-Commerce Store ===\n');
                        
                        // 1. Browse products
                        console.log('All Products:');
                        console.log(getAllProducts());
                        
                        // 2. Search for products
                        console.log('\nSearching for "phone":');
                        console.log(searchProducts('phone'));
                        
                        // 3. Add items to cart
                        console.log('\n=== Adding to Cart ===');
                        console.log(addToCart(1, 2));  // 2 Laptops
                        console.log(addToCart(3, 3));  // 3 Headphones
                        console.log(addToCart(1, 1));  // 1 more Laptop (should update quantity)
                        
                        // 4. View cart
                        console.log('\n=== Current Cart ===');
                        console.log(getCartItems());
                        console.log('Cart Total:', getCartTotal());
                        
                        // 5. Update quantity
                        console.log('\n=== Updating Quantities ===');
                        console.log(updateQuantity(1, 2));  // Change laptop quantity to 2
                        
                        // 6. Remove item
                        console.log('\n=== Removing Item ===');
                        console.log(removeFromCart(3));  // Remove headphones
                        
                        // 7. View updated cart
                        console.log('\n=== Updated Cart ===');
                        console.log(getCartItems());
                        console.log('Cart Total:', getCartTotal());
                        
                        // 8. Checkout with coupon
                        console.log('\n=== Checkout ===');
                        const order = processPayment('upi', 'WELCOME10');
                        console.log(order);
                  