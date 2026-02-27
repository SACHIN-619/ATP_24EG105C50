
let arr = [23,45,75,98]
let sum=0;
function sumArr(arr){
    for(let i=0;i<arr.length;i++){
        sum+=arr[i]
    }
    return sum

}
let result = sumArr(arr)
console.log(result)