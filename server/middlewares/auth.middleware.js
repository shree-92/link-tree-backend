import jwt from "jsonwebtoken"
import dotenv from "dotenv"


import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"

dotenv.config()

// middleware to check if user is authenticated to access protected routes
const isUserAuthenticated = asyncHandler(async(req, res, next)=>{
    let token;

    // storing the value of cookie which user has to validate and grant access to protected route
    token = req.cookies.jwt;

    // if no token / cookie
    if(!token){throw new ApiError("401", "acess denied")}

    // decoding to validate the current user
    const decode = jwt.verify(token, process.env.JWT_SECRET)

    // checking if such user exist based on decoded user id
    const userExist = await User.findById(decode.userID).select("-password");

    // if no user found the cookie is invalid
    if(!userExist){
        throw new ApiError(404, " invalid token")
    }else {
        
        // attaching the user fund to req object so upcoming middlewares can acess it and perform their task
        req.user = userExist;
        next() // letting the next middleware run since the current one has completed his job
    }

})


export {isUserAuthenticated}