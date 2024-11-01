import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

const generateToken = async(res, userID)=>{

    // generate a token
    const token = jwt.sign({userID}, process.env.JWT_SECRET, {
        expiresIn:"1d"
    })

    // setting the token has a cookie
    res.cookie("jwt", token , {
        httpOnly:true,
        //secure: true, // uncomment on deployment
        // sameSite: "none",
        maxAge: (24*60*60*1000) * 1 // cookie will vanish in one day
    })

    return res
}

export { generateToken }
