import mongoose, {Schema, Types} from "mongoose";

const LinkSchema = new Schema({

    title:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true,
    },
    icons:{
        type:String,
        required:true,
    }
})

const imageSchema = new Schema({

    image_url:{
        type: String,
        default:"https://placehold.co/400"
    },
    public_id:{
        type:String,
        // required:true,
        default:"CLOUINARY PUBLIC ID HERE"
    }
})

const userSchema = new Schema({

    username:{
        type: String,
        unique:true,
        required:true
    },
    email:{
        type: String,
        unique:true,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    pfp : imageSchema,
    bio:{
        type:String,
    },
    name:{
        type:String,
    },
    links:[LinkSchema]

}, {timestamps:true})


const User = mongoose.model("User", userSchema)

export {User}