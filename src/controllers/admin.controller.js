const User=require("../models/user.model.js")
const Appointment=require("../models/appointment.model.js")
const AppError=require("../utils/AppError.js")

const getAllUsers=async(req,res,next)=>{
	try{
		const users=await User.find().select("-password");

		return res.send({
			success:true,
			data:users
		})
	}catch(err){
		next(err)
	}

}

const deleteUser=async(req,res,next)=>{
	try{
		const id=req.params.id
		const user=await User.findByIdAndDelete(id)
							.select('-password');
		if (!user){
			throw new AppError(404,"user not found")
		}
		await Appointment.deleteMany({
	      $or: [{ patientId: id }, { doctorId: id }]
	    });
		return res.send({
			success:true,
			data:user
		})
	}catch(err){
		next(err)
	}

}



const updateUser=async(req,res,next)=>{
	try{
		const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators: true})
							.select('-password');
		if (!user){
			throw new AppError(404,"user not found")
		}
		user.password=undefined;
		return res.send({
			success:true,
			data:user
		})
	}catch(err){
		next(err)
	}

}

const getAllAppointments=async(req,res,next)=>{
	try{
		const appointments=await Appointment.find()
											.populate("doctorId","username email specialization")
											.populate("patientId","username email")
		return res.send({
			success:true,
			data:appointments
		})
	}catch(err){
		next(err)
	}

}

const deleteAppointment=async(req,res,next)=>{
	try{
		const appointment=await Appointment.findByIdAndDelete(req.user.id)
		if (!appointment){
			throw new AppError(400,"appointment not found")
		}
		return res.send({
			success:true,
			data:appointment
		})
	}catch(err){
		next(err)
	}

}



module.exports={getAllUsers,deleteUser,updateUser,getAllAppointments,deleteAppointment}