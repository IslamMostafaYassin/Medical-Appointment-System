const User = require("../models/user.model.js");
const Appointment=require("../models/appointment.model.js")
const isValidDate=require("../utils/isValidDate.js")
const AppError=require("../utils/AppError.js")

/**
 * @swagger
 * /api/v1/appointments/doctors:
 *   get:
 *     summary: Get all registered doctors
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of doctors retrieved successfully
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
 *     summary: Book a new appointment (Patient only)
 *     tags: [Appointments]
 *     security:
 *       - cookieAuth: []
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
 *                 format: date-time
 *                 example: 2026-09-01T10:30:00.000Z
 *     responses:
 *       201:
 *         description: Appointment successfully created
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
 *         description: Invalid date format, non-patient caller, or time slot already taken
 *       404:
 *         description: Doctor not found
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
 * /api/v1/appointments/my-appointments:
 *   get:
 *     summary: Get appointments for the currently logged-in patient or doctor
 *     tags: [Appointments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user appointments retrieved successfully
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
 *         description: User role is neither doctor nor patient
 *       401:
 *         description: Unauthenticated
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