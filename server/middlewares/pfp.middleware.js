import multer from "multer";
import path from "path";

// creating a multer storage
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, "server/public/temp")
    },
    filename:function(req, file, cb){
        cb(null, 
            file.fieldname  + "-" + Date.now() + path.extname(file.originalname)
        )
    }
})

// file filter function
const checkFileFilter = (req, file, cb)=>{

    if(file.mimetype.startsWith("image")){
        cb(null, true)
    }else{
        cb(new Error("not an image"))
    }
}


// multer middleware

const upload = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits : {
        fieldSize: (1024 * 1024) * 5 // 5 mb size limit
    }
})

export default upload;