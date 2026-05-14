
let arr = [23,45,75,98]
let sum=0;
let key=45
function sumArr(arr,key){  // pasing array in function 
    for(let i=0;i<arr.length;i++){
        if(arr[i]==key){
            return `key ${key} found`
        }
        
    }
    return `key ${key} not found in array`   // reurning string 

}
let result = sumArr(arr,key)
console.log(result)