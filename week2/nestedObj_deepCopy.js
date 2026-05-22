let person = {
    name:"Sachin",
    address:{
        city:"Hyderabad",
        pincode:2432235
    }
}

//shallow copy
let po = {...person}
//deep copy
let p1 = structuredClone(person)

console.log(po)
console.log(p1)