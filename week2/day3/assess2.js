/*ASSIGNMENT 1:
-------------
You are building a shopping cart summary for an e-commerce website.

Test Data : 
const cart = [
  { id: 101, name: "Laptop", price: 60000, quantity: 1, inStock: true },
  { id: 102, name: "Mouse", price: 800, quantity: 2, inStock: true },
  { id: 103, name: "Keyboard", price: 1500, quantity: 1, inStock: false },
  { id: 104, name: "Monitor", price: 12000, quantity: 1, inStock: true }
];

Tasks:
    1. Use filter() to get only inStock products
    2. Use map() to create a new array with:  { name, totalPrice }
    3. Use reduce() to calculate grand total cart value
    4. Use find() to get details of "Mouse"
    5. Use findIndex() to find the position of "Keyboard" */
const cart = [
  { id: 101, name: "Laptop", price: 60000, quantity: 1, inStock: true },
  { id: 102, name: "Mouse", price: 800, quantity: 2, inStock: true },
  { id: 103, name: "Keyboard", price: 1500, quantity: 1, inStock: false },
  { id: 104, name: "Monitor", price: 12000, quantity: 1, inStock: true }
];

// let d1 = cart.filter(function(ArrayObj){
//     if(cart.inStock){
//         return cartArrayObj.name
//     }
// })

let d1 = cart.filter(e1=>e1.inStock==true)
console.log(d1)


let d2 = cart.map(e1=>e1.name+" "+e1.price)
console.log(d2)

let d3 = cart.reduce((Tv,v)=>Tv+v.price,0)
console.log("Total Value: ",d3)

let d4 = cart.find(v=>v.name=="Mouse")
console.log(d4)

let d5 = cart.findIndex(v=>v.name=="Mouse")

console.log("Index: ",d5)
