import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {generateToken} from "../utils/setCookie.js"
import {uploadToCloudinary} from "../utils/cloudinary.js"

import { User } from "../models/user.model.js";

import bcrypt from "bcryptjs"
import fs, { appendFile } from "fs"

const registerController = asyncHandler(async(req, res)=>{

    // getting the user data from body
    const {username, password, email} = req.body;

    // validating the user data
    if( !username || !password || ! email){rea.status(404).json({message: "all fields are required to register"})};

    if(password.length < 8){res.status(401).json({ message: "Password is too short" })};

    const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Invalid email format" });
    }

    // check if such USERNAME is taken
    const takenUsername = await User.findOne({username});
    if(takenUsername){res.status(401).json({ message: "this url is taken" })}

    // check if the email is taken
    const takenEmail = await User.findOne({email});
    if(takenEmail){res.status(401).json({ message: "Email is already taken" })}

    // hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // if above checks are passed create the new unique user
    const createUser = await User.create({username, email, password:hashedPassword});

    // check is the user has been created
    if(!createUser){res.status(500).json({ message: "Failed to create a new user" })}

    // sending a response
    res.status(200).json({message : "created the new user"})

})

const loginController = asyncHandler(async(req, res)=>{

    // getting the user data from body
    const {username, password} = req.body;

    // validating the user data
    if(!username || !password){throw new ApiError(401, "all fields are required")}

    if(password.length < 8){throw new ApiError(401, "password is too smol")}

    // finding the user based on userdata
    const user = await User.findOne({username});

    if(!user){throw new ApiError(404, "user not found")}

    // comparing the passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // wrong pass
    if(!isPasswordCorrect){throw new ApiError(401, "wrong username or password try again")}

    // correct pass give cookie
    generateToken(res, user._id)

    res.status(200).json("user logged in")

})


const logoutController = asyncHandler(async(req, res)=>{

    res.cookie("jwt", "", {
        httpOnly:true,
        expires:new Date(0),
    })

    res.status(200).json("cookie vanished")
})

const updateCurrentUser = asyncHandler(async(req,res)=>{

    // getting an image and also getting rid of it asap
    const {url, publicID} = await uploadToCloudinary(req.file.path)
    fs.unlinkSync(req.file.path) // deleting the file from local storage

    // getting user data from body
    const {name, bio, links } = req.body;

    // finding the current user based on the prev middlewares auth check
    const currentUser = await User.findById(req.user._id).select("-password")

    if(!currentUser){throw new ApiError(404, "failed to find current user login again")}

    // validating user data
    if(!name || !bio || !links){throw new ApiError(404, "all fields are required to create profile")}

    // validating bio
    if(bio.length > 100 || bio.length < 10){throw new ApiError(401, "bio is too short or too big")}

    // converting links into an array
    let parsedLinks;
    try {
        parsedLinks = JSON.parse(links);
    } catch (error) {
        throw new ApiError(400, "Links must be a valid JSON array");
    }
   

    // check for links is a array or not
    if(!Array.isArray(parsedLinks)){throw new ApiError(400, "links should be an array")}

    // furthur validating links
    for(const link of parsedLinks){
        if(!link.title || !link.url || !link.icons){throw new ApiError(400, "each link should have an title an url and icon")}
    }

    // pfp logic below

    // check if we have a file
    if(!req.file){throw new ApiError(404, "no file received for pfp")};

    // uploading the file to cloudinary

    // smol check to make sure we have image url and id
    if(!url || !publicID){throw new ApiError(401, "image url and public id not found")}
    

    // upadting the current user and filling all his new details

    if(url && publicID){
        currentUser.pfp = {image_url:url, public_id:publicID};
    }
    currentUser.name = name || currentUser.name;
    currentUser.bio = bio || currentUser.bio;
    currentUser.links.push(...parsedLinks);

    // incase the current user wanna change his

    // saving our updated user
    await currentUser.save()

    res.status(201).json({message:"profile updated", userData:currentUser })

})

const getCurrentUser = asyncHandler(async(req, res)=>{
    // finding based on cookie
    const currentUser = await User.findById(req.user).select("-password");

    // throwing error if user not found
    if(!currentUser){throw new ApiError(404, "failed to get curret user")}

    // sending a response
    res.status(200).json(currentUser)

})

const deleteCurrentUser = asyncHandler(async(req,res)=>{

    // finding the user based on the provided userId
    const userToDelete = await User.findById(req.user);

    if (!userToDelete) {throw new ApiError(404, "User not found");}

    // deleting the user
    await User.findByIdAndDelete(req.user);

    // sending a response
    res.status(200).json({ message: "User deleted successfully" });

})

const getUserDetails = asyncHandler(async(req, res)=>{

    // gettinig user data based on dynamic url
    const {username} = req.params;

    // finding that user
    const user = await User.findOne({username}).select("-password");

    // if user doesnt exist
    if(!user){throw new ApiError(404, "no user found")};

    // sending a response
    res.status(200).json(user)
})

export {
    loginController,
    logoutController,
    registerController,
    updateCurrentUser,
    getCurrentUser,
    deleteCurrentUser,
    getUserDetails,
}


