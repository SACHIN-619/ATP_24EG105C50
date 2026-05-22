// import { verify } from "jsonwebtoken"
import jwt from 'jsonwebtoken'
const  {verify}  = jwt

export function verifyToken(req, res, next) {
    //token verification Logic 
    const token = req.cookies?.token
    // if req is from unauthorised user

    if (!token) {
        return res.status(201).json({ message: "plz relogin" })
    }

    //if token is existed
    //there is need of verify in jwt mdoule which
    try {
        const decodedToken = verify(token, 'abcdef')
        console.log(decodedToken);
        //attch decoded user to req
        req.user=decodedToken
        //call nxt
        next();
    } catch (err) {
        res.status(401).json({ message: "session expired. plz relogin" })//same origin req if loin after long itme
    }
}