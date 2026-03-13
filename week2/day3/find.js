//sort or toSorted() for original array

let data = [9,34,3,66,2]
//lexical comparison
let newArray = data.toSorted()
console.log("new Array is ",newArray)

let nA1 = data.toSorted((a,b)=>b-a)
console.log(data)
console.log(nA1)