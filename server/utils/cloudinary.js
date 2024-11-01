import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"

// lets us access env
dotenv.config()

// config acc to their website
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUDNAME,
    api_key : process.env.CLOUDINARY_API_KEY ,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})

// alll acc to their website theres not much to comment here
const uploadToCloudinary = async(filepath)=>{

    try {

        const result = await cloudinary.uploader.upload(filepath, {
            resource_type: "image",
            allowed_formats: ["jpg", "png", "gif", "jpeg"], /// users are only allowed to upload images
        })

        // if not image then we are not keeping it on our cloud storage
        if (result.resource_type !== 'image') {
            await cloudinary.uploader.destroy(result.public_id);
            throw new Error('Uploaded file is not an image, and has been removed.');
        }

        return {
            url : result.secure_url, // url to store in our db
            publicID : result.public_id, // willl use this if to remove it from cloudinary
        }

    } catch (error) {
        console.log('error while uploading to cloudinary', error);
        throw new Error(error)
    }
}

export {uploadToCloudinary}