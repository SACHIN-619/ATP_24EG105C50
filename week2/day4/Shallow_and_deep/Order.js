const order = {
    orderId: "ORD1001",
    customer: {
        name: "Anita",
        address: {
            city: "Hyderabad",
            pincode: 500085
        }
    },
    items: [
        { product: "Laptop", price: 70000 }
    ]
};

let order1 = structuredClone(order)


order.customer.address.city="Warangal"
order.items[0].price=9000

console.log(order)

console.log(order1)




