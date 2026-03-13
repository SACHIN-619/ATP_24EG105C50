//Spread op (create copy of array and objects)

let  obj = {a:10,b:30}
let copyObj = {...obj}

copyObj.a=32

console.log(obj) //original maintianed as copyObj modified spread op instead of assignment
console.log(copyObj)