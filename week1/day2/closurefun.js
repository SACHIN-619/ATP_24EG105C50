//closure actives when fucntion return other funciton

let sum = function(x){
    return function(y){
        return x+y
    }
}

let result = sum(10)

console.log(result(20))  //x is not defind but but it comes 30