import express, {urlencoded} from "express";
import dotenv from "dotenv"
import cors from 'cors'
import cookieParser from "cookie-parser";

// lets us access env file
dotenv.config()

// creating instance of express server
const app = express()

// using the cors middleware to avoid CORS issues
app.use(cors({
    origin: "https://link-tree-frontend.vercel.app", // replace with front end url on deployment
    credentials:true
}))

// using middlewares
app.use(express.json()) // to let us access the data from body
app.use(urlencoded({extended:true}))
app.use(cookieParser()) // to let us access the cookies

//import routers below
import userRouter from "./routes/user.route.js"

// declare routes below
app.use("/api/v1/user", userRouter )

// public DYNAMIC ROUTE
import {getUserDetails} from "./controllers/user.controller.js"
app.route("/:username").get(getUserDetails)

export {app}
