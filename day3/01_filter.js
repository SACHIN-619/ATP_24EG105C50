//Advanced aray ops

let testData = [90,23,70,34,-32,-1,0]

let r = testData.filter((element) => element > 30);

console.log(r);

//get element between 40 and 80

// let w = testData.filter(function(element){
//     if(element>40 && element<80){
//         return element
//     }
// })
let r2 = testData.filter(element => element > 40 && element<80);


//map method
console.log("map method===========")

let r3 = testData.map(element=>element+10)
console.log(r3)


// check if all are element>50


let r4 = testData.map(function(element){
      if(element>50){
    // return testData.map(element=>element-20)
    return element-20
}
else{
    // return testData.map(element=>element+10)
    return element+10
      }
})

console.log(r4)



//Reduce
console.log("reduce method")


const sum=testData.reduce((accumulator,element)=>accumulator+element)

console.log(sum)

// let big=-999
// let small=999
// const BigSmall = testData.reduce(function(size,element){
//     if(size>element){
//         return big=size
//     }
//     if(size<element){
//         return small=size
//     }
// }
// )

let big=testData.reduce((acc,element)=>acc<element?element:acc)
let small=testData.reduce((acc,element)=>acc>element?acc:element)

console.log(big+" "+small)

//find and findAll
console.log("=============find or findAll=============")

let el1 = testData.find(element=>element==90)
console.log(el1)

