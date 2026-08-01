const mongoose=require("mongoose")

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