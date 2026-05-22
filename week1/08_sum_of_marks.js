let marks = [98,78,65,98]
let small = 999
for(let i=0;i<marks.length;i++){
    console.log(marks[i])


    // console.log(10**)

    if(marks[i]<small)
    {
        small = marks[i]
    }
}

console.log(`smallest marks is ${small}`)
