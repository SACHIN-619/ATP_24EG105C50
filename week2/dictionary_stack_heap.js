let person ={
    name:"ravi",
    age:25
}
// ref store in stack
// and obj store in heap

// add new property
person.city='hyd'

console.log(person)  

// Update the property

person.name='sachin'
console.log(person)  

//delete a property

delete person.age
console.log(person)  

