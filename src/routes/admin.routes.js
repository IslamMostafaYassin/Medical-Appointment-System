const express=require("express")
const {authenticate,authorize}=require("../middleware/auth.middleware.js")
const {getAllUsers,deleteUser,updateUser,getAllAppointments,deleteAppointment}=require("../controllers/admin.controller.js")

const router=express.Router()

router.use(authenticate,authorize);

router.get("/appointments",getAllAppointments)
router.get("/users",getAllUsers)
router.delete("/users/:id",deleteUser)
router.delete("/appointments/:id",deleteAppointment)
router.put("/users/:id",updateUser)

module.exports=router