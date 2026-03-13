    

### uer Authentication (Login)
  -Submit credentials and get token

   -public routes  (By anyone)
   -protected routes ( By authenticated users only)
  what is RSA,when to use Hmac key e jwt pagewebsites
    npm i jsonwebtoken
--------------------------------------------
  req----->public routes (By anyone)

  req----->middleware----->Protected routes( By
              uthenticated users only)
to access cookie  req object we need cookie parser middlewar otherwise
respect.cookie is middleware
  
  npm i cookie-parser in terminal and import and use in app in server

  --------------------------------------
Day9
  CrossOrigin vs Same Origin

  Crossoring req means when client and server application are running in difffernt domains

  sameOrigin req. means Cleint also running on same domain of the server.

  Cookies will sent along with reeq. automatically in same origin req. 
  but for CrossOrigin req. 
  The token should be explicitly included to the req.
  -----------------------------

  embedding document(updating gets diffecult) and reference document(contiants referece of origicnal)