//function declaration

function findSum(a,b){  
    console.log("first")
    let sum=a+b
    return sum
}

let test = function(a,b){   // storing return of function in a variable names
    let sum = a+b
    return sum
}

let result1=test(10,20)  // passing values to variable storing function
console.log(result1)


// let result = findSum(4,6)
// console.log(`sum  is ${result}`)
console.log(`sum  is ${findSum(3,6)}`)
