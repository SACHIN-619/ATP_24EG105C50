

// let bigger = (a,b,c) => (a>b)?{(a>c)?a:c}:b

// console.log(bigger)

function big(a,b,c){
   if((a>b)&&(a>c)){
         return a
   }
   if((b>a)&&(b>c)){
         return b
   }
   else{
    return c
   }
   
}

let result = big(2,34,3)

console.log(result)