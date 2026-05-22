//Array-group of homog element

let names = ['harshit','sathvik','Kranti']

//itertae(for-of loop
for(let v of names){
    console.log(v)
}
  

//objects  - its  group of property

let student =  {
    sno:'24eg105c50',
    sname:'sachin',
    age:' 19 yrs old',
    Scourse:'B.tech'
}

console.log(student.sno)
// console.log(student['sno'])
for(let v in student){
    console.log(`${v} is ${student[v]}`)  //w
}


