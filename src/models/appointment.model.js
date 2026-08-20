const mongoose=require("mongoose")

 /**
  * @swagger
  * components:
  *   schemas:
  *     Appointment:
  *       type: object
  *       required:
  *         - patientId
  *         - doctorId
  *         - date
  *       properties:
  *         patientId:
  *           type: string
  *           description: user ObjectId refering to a patient
  *           example: 66b1a2f43d8c11a2489e0123
  *         doctorId:
  *           type: string
  *           description: user ObjectId refering to a doctor
  *           example: 66b1a2f43d8c11a2489e0456
  *         date:
  *           type: string
  *           description: the date of the appointment that must be in the future and in standard time and on 30 minute intervals. ex:(11:30, 12:00)
  *           example: 2026-09-01T10:30:00.000Z
  */
const appointmentSchema=new mongoose.Schema({
		patientId:{
			type:mongoose.ObjectId,
			required:true,
			ref:"User",
		},
		doctorId:{
			type:mongoose.ObjectId,
			required:true,
			ref:"User",
		},
		date:{
			type:Date,
			required:true
		},
	},
{
	timestamps:true
})

const appointmentModel=mongoose.model("Appointment",appointmentSchema)

module.exports=appointmentModel