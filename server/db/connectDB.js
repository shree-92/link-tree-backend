import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionStr = process.env.MONGODB_URI;


const connectDB = async ()=>{

    try {

        // making an connection to db
        const response = mongoose.connect(connectionStr);
        console.log("connected to db successfully");

    } catch (error) {
        console.log("failed to connect to db",error);
    }
    
}

export default connectDB