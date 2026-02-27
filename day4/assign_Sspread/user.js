let user = {
    name: "Ravi",
    city: "Hyderabad"
};

user.name='Sachin'
let updatedUser = {...user}
let updatedUser1 = {...user,age:25}

// console.log(`real user ${user}  and updated user ${updatedUser} updated user2 ${updatedUser1}`)
 console.log('real user',user ,' and updated user',updatedUser,' updated user2' , updatedUser1)


//  Exercise 3: Create a function that receives any number of args as arguments and return their sum using REST parameter
                        
                        
                        
//                         Tasks
                        
//                               -> Create a new object updatedUser
                              
//                               -> Copy all properties from user
                              
//                               -> Add a new property age: 25
                              
//                               -> Print both objects
                        
                        
                        
//                         ✅ Expected Output
//                               { name: "Ravi", city: "Hyderabad" }
//                               { name: "Ravi", city: "Hyderabad", age: 25 }
                        
//                         👉 Original object should remain unchanged.