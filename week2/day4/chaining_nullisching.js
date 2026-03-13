// optional chaining and nullishiching

let person={
    pid:100,
    name:"sachin"
    
}

console.log(person.pid)
console.log(person.name)
console.log(person.marks)
console.log(person.marks?.length??"Marks not available")
// console.log(person.pid)
