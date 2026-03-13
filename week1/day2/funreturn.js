

let test = function(){
    return function(){
        return [23,63,2]+' array'
    }
}

let result = test()

console.log(result())