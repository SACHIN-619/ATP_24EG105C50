const temp = [32,35,41,28,40,38,30,42]

let t1 = temp.filter(element=>element>35)
console.log(t1)

// celcius to Fahrenhiet
// F-32/9 =c/5

let conv = temp.map(function(element){
    let newEl =((element*9)/5)+32
    return newEl
})

console.log("Temp convert to Fahrenheit", conv)

let t2 = temp.reduce((avg,element)=>avg)
console.log(t2)

let t3 = temp.find(element=>element>40)
console.log(t3)
// reduce() initialze acc as 0
console.log("init acc")

//let som = reduce((acc,acc)=>acc+ele,0)  on array of object


