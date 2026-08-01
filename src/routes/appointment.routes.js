const express=require("express")
const { authenticate } = require("../middleware/auth.middleware.js");
const {getAllDoctors,createAppointment,getMyAppointments} =require("../controllers/appointment.controller.js")
const {createAppointmentSchema}=require("../schemas/appointment.schema.js")
const validate=require("../middleware/validate.middleware.js")

const router=express.Router()

router.use(authenticate)

router.get("/doctors",getAllDoctors);

router.post("/",validate(createAppointmentSchema),createAppointment);

router.get("/my-appointments",getMyAppointments)


module.exports=router