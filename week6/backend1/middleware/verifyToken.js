import jwt from 'jsonwebtoken'
const {verify} = jwt
import {config} from 'dotenv'


config()


export const verifyToken=(...allowedRoles)=>{  ///rest parametr can take any values

    return (req,res,next)=>{
  try{
        //get token from cookie
        const token = req.cookies?.token
        //check token existed or not
        if(!token){
            return res.status(401).json({message:"Please login first"})
        }
        //add decoded token
        const decodedToken=verify(token,process.env.SECRET_KEY)
        //valdite otken(decode the token)
        req.user=decodedToken

        //check the role if same as decodedToken
         if(allowedRoles.length > 0 && !allowedRoles.includes(decodedToken.role)){
            return res.status(403).json({message:"you are not authorized"})
         }
        next()
    }
    catch(err){
        res.status(401).json({message:"Invalid User"})
    }
    }
}

// export const verifyToken=async(req,res,next)=>{
    //     try{
        
    //         //get token from cookie
//         const token = req.cookies?.token
//         //check token existed or not
//         if(!token){
//             return res.status(401).json({message:"Please login first"})
//         }
//         //add decoded token
//         const decodedToken=verify(token,process.env.SECRET_KEY)
//         //valdite otken(decode the token)
//         req.user=decodedToken

//         //check the role if same as decodedToken
//         next()
//     }
//     catch(err){
//         res.status(401).json({message:"Invalid User"})
//     }
// }



//middleware to verify token
// export const verifyToken = (req, res, next) => {
//     const token = req.cookies?.token;
//     if (!token) {
//         return res.status(401).json({ message: 'No token provided' });
//     }
//     try {
    //         const decoded = verify(token, process.env.SECRET_KEY);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         res.status(401).json({ message: 'Invalid token' });
//     }
// };

// export verifyToken = verifyToken