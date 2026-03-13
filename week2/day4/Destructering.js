// Destuctering(unpacking)

let arr = [12,34,2,34]
let [a,b,c,d] = arr

console.log(a,b)

let emp={
    eid:100,
    company:"AU",
    address:{
        city:"hyd"
    }
}

let {eid,company,address:{city}} = emp

console.log(eid,company,city)