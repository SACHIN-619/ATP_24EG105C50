//Test data
let users=[]
//Create API(RESTapi - Repressentational Strate Transfer)
     //Route to handle GET req of Client
    app.get('/users',(req,res)=>{
        //send all user and send req
        res.json({message:"all people",payload:users})
    })
   app.get('/users/:id',(req,res)=>{
      // get user id from url param
      let idOfUrl = Number(req.params.id)
      // find user
      let user = users.find(userObj => userObj.id == idOfUrl)
      // if user not found
      if(user == undefined){
         return res.status(404).json({message:"User not found"})
      }
      // send res
      res.json({message:"a user",payload:user})
   })


    //Route to handle POST req of Client
    app.post('/users',(req,res)=>{
      //get new user from client
      // console.log(req.body)
      const newUser =req.body
      //push user into users
      users.push(newUser)
      //send res
      res.json({message:"User created"})
         //   res.json({message:"This is message: hello"})
    })
    
     //Route to handle PUT req of Client
     app.put('/users',(req,res)=>{
      //   res.json({message:"This is message")
      let modifiedUser = req.body
      //get modified user form Client {}
      //get index of existing user in users array
      let index=users.findIndex(userObj=>userObj.id==modifiedUser.id)
      //user not found
      if(index==-1){
         return res.json({message:"User not found"})
      }
      //updat user with index
      users.splice(index,1,modifiedUser)
      
      //send res
      res.json({message:"User updated"})

     })

     //Route to handle DELETE req of Client
     app.delete('/users/:id',(req,res)=>{
      //   res.json({message:"This is message"})
      //get id of user from url parameter
      let idOfUrl=Number(req.params.id)  //{id: '5}
      //find index of user
      let index = users.findIndex(userObj=>userObj.id==idOfUrl)
      //if user not found
      if(index==-1){
         return res.json({message:"User not found to delete"})
      }

      //delete the user by index
      users.splice(index,1)
      //send res
      res.json({message:"User removed"})

     })