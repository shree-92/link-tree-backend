import {Router} from "express"

// coontrollers
import {deleteCurrentUser, updateCurrentUser, getCurrentUser, loginController, logoutController, registerController} from "../controllers/user.controller.js"
import { isUserAuthenticated } from "../middlewares/auth.middleware.js"
import imageUploadMiddleware from "../middlewares/pfp.middleware.js" 

const router = Router()

//  PUBLIC authentication ROUTES
router.route("/register").post(registerController)
router.route("/login").post(loginController)
router.route("/logout").post(logoutController)

// PROCTED routes
router.route("/my-profile")
    .post(isUserAuthenticated, imageUploadMiddleware.single("image"), updateCurrentUser)
    .get(isUserAuthenticated , getCurrentUser)
    .delete(isUserAuthenticated , deleteCurrentUser)


export default router