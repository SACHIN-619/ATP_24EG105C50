//restparametr should be last formal parameter

//write a function that recievies any no of args and return their sum
sum = 0
function user(...a){
//   console.log(a)

//   return sum+(a)

  let sum = a.reduce((a,b)=>a+b)
  return sum
}

let s = user(1,345,23,56,234,-234)

console.log(`sum : ${s}`)