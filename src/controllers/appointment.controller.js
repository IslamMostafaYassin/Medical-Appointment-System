const User = require("../models/user.model.js");
const Appointment=require("../models/appointment.model.js")
const isValidDate=require("../utils/isValidDate.js")
const AppError=require("../utils/AppError.js")

/**
 * @swagger
 * /api/v1/appointments/doctors:
 *   get:
 *     summary: get all doctors
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: doctors returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: unauthenticated
 */
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

/**
 * @swagger
 * /api/v1/appointments:
 *   post:
 *     summary: create an appointment (patient only)
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - date
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: 66b1a2f43d8c11a2489e0999
 *               date:
 *                 type: string
 *                 example: 2026-09-01T10:30:00.000Z
 *     responses:
 *       201:
 *         description: appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: invalid date format, caller is not a patient, or time already taken
 *       401:
 *         description: unauthenticated
 *       404:
 *         description: doctor not found
 */
const createAppointment=async(req,res,next)=>{
	try{
		const {userId,role}=req.user;
		if (role!=="patient"){
			throw new AppError(400,"you must be a patient to make an appointment")
		}
		const {doctorId,date}=req.body
		if (!isValidDate(date)) {
      throw new AppError(
        400,
        "invalid date. make sure it is an upcoming time within 30 days and on 30-minute intervals. ex:(11:30, 12:00)."
      );
    }
		const doctorExists = await User.findOne({ _id: doctorId, role: "doctor" });
	    if (!doctorExists) {
	      throw new AppError(404, "doctor not found");
	    }
		const bookedAppointment=await Appointment.findOne({"$or":[{doctorId},{patientId:userId}],date});
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

/**
 * @swagger
 * /api/v1/appointments/me:
 *   get:
 *     summary: get appointments for logged in patient or doctor
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: appointments returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: User role must be a doctor or a patient
 *       401:
 *         description: unauthenticated
 */
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