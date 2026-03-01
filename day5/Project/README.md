### Steps to create backend


1.Generate packange.json file
       npm init -y   (change description,type,etc)
2.Create HTTP server
     -  Install & Import express module
           npm install express
     - Import express

       To update the server automatically [npm install -g nodemon] and run [nodemon server.js]


POST REQ,PUT REQ SHOULD SEND DATA OF API AS BODY OF REQ OBJ.
GET AND DELETE REQ DONOT SUPPORT BODY OF REQ ONJECT,SO THAT THESE TWO REQ SEND 
  DATA THROUGH ENDPOINT..