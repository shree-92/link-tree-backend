import connectDB from "./db/connectDB.js";
import { app } from "./app.js";

import dotenv from "dotenv" ; dotenv.config(); // to access the port

const port = process.env.PORT

connectDB()
.then(
    ()=>{
        app.listen(port);
        console.log(`successs server is listening at port ${port}`);
    }
)
.catch(
    (error)=>  {console.log("failed", error); process.exit(1)}
)