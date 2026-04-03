 - Create HTTP Server
        - Create Employee Schema(
                name,email,mobile,designation & companyName
                ) and model
        - Define REST API routes for
                - Create Employee
                - Read all employees
                - Edit employee
                - Delete Employee


31-03-26

Client side application and server side application can interact with 
each other over http protocol by making http req and recieving http res.

To make http req from client side app , one can use either fetch fun or aios module.

The following are the http req types:-

      GET - To read all resources
      PUT - To create new resource
      POST - To update eitre resource
      DElETE - To delete a resourc
      PATCH - TO UPDATE A RESOUCE PARTIALLY


POST, PUT, PATCH can have body prop which can hold on data, whereas
 GET,DELETE  dont have bdoy prop they can send data through url*

 instead of fetch function we we axios easy and adv
   npm i axios and import