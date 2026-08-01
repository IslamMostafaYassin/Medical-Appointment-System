const User = require("../models/user.model.js");
const Appointment=require("../models/appointment.model.js")
const isValidDate=require("../utils/isValidDate.js")
const AppError=require("../utils/AppError.js")

const getAllDoctors=async(req,res,next)=>{
	try{
		const doctors=await User.find({role:"doctor"})
								.select("-password");
		res.send({
			success:true,
			data:doctors
		})
	}catch(err){
		next(err)
	}
}

const createAppointment=async(req,res,next)=>{
	try{
		const {userId,role}=req.user;
		if (role!=="patient"){
			throw new AppError(400,"you must be a patient to make an appointment")
		}
		const {doctorId,date}=req.body
		if (!isValidDate(date)){
			throw new AppError(400,"invalid date")
		}
		const doctorExists = await User.findOne({ _id: doctorId, role: "doctor" });
	    if (!doctorExists) {
	      throw new AppError(404, "doctor not found");
	    }
		const bookedAppointment=await Appointment.findOne({"$or":[{doctorId,patientId:userId}],date});
		if (bookedAppointment){
			throw new AppError(400,"time already taken")
		}
		const patientId=userId
		const newAppointment=await Appointment.create({
			patientId,
			doctorId,
			date,
		})
		await newAppointment.populate("doctorId","username email specialization")
							.populate("patientId","username email");

		res.status(201).send({
			success:true,
			data:newAppointment
		})
	}catch(err){
		next(err)
	}
}

const getMyAppointments=async(req,res,next)=>{
	try{
		const {userId,role}=req.user
		let appointments=[];
		if (role==="doctor"){
			appointments=await Appointment.find({doctorId:userId})
											.populate("doctorId","username email specialization")
											.populate("patientId","username email");

		}else if (role==="patient"){
			appointments=await Appointment.find({patientId:userId})
											.populate("doctorId","username email specialization")
											.populate("patientId","username email");

		}else{
			throw new AppError(400,"you must be a doctor or a patient")
		}
		res.send({
			success:true,
			data:appointments
		})
	}catch(err){
		next(err)
	}
}



module.exports={getAllDoctors,createAppointment,getMyAppointments}