const express=require("express")
const {register,login,logout,getCurrentUser}=require("../controllers/auth.controller.js")
const validate=require("../middleware/validate.middleware.js")
const {registerSchema,loginSchema}=require("../schemas/auth.schema.js")
const {authenticate} = require("../middleware/auth.middleware.js")


const router=express.Router()

router.post("/register",validate(registerSchema),register)
router.post("/login",validate(loginSchema),login)
router.get("/logout",logout)
router.get("/profile",authenticate,getCurrentUser)


module.exports=router