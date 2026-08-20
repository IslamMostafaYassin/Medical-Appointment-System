const User=require("../models/user.model.js")
const Appointment=require("../models/appointment.model.js")
const AppError=require("../utils/AppError.js")

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: get all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: users returned successfully
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
 *       403:
 *         description: unauthorized
 */
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


/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   delete:
 *     summary: delete a user and their related appointments
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: the ID of the user to delete
 *     responses:
 *       200:
 *         description: user deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: unauthenticated
 *       403:
 *         description: unauthorized
 *       404:
 *         description: user not found
 */
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


/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   put:
 *     summary: update a user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: the ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newName
 *               email:
 *                 type: string
 *                 example: newName@email.com
 *               role:
 *                 type: string
 *                 enum: [patient, doctor, admin]
 *               specialization:
 *                 type: string
 *                 example: neurology
 *     responses:
 *       200:
 *         description: user updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: unauthenticated
 *       403:
 *         description: unauthorized
 *       404:
 *         description: user not found
 */
const updateUser=async(req,res,next)=>{
	try{
		const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators: true})
							.select('-password');
		if (!user){
			throw new AppError(404,"user not found")
		}
		return res.send({
			success:true,
			data:user
		})
	}catch(err){
		next(err)
	}

}


/**
 * @swagger
 * /api/v1/admin/appointments:
 *   get:
 *     summary: return all appointments
 *     tags: [Admin]
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
 *       401:
 *         description: unauthenticated
 *       403:
 *         description: unauthorized
 */
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


/**
 * @swagger
 * /api/v1/admin/appointments/{id}:
 *   delete:
 *     summary: delete an appointment by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: the ID of the appointment to delete
 *     responses:
 *       200:
 *         description: appointment deleted successfully
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
 *         description: appointment not found
 *       401:
 *         description: unauthenticated
 *       403:
 *         description: unauthorized
 *       404:
 *         description: user not found
 */
const deleteAppointment=async(req,res,next)=>{
	try{
		const appointment=await Appointment.findByIdAndDelete(req.params.id)
		if (!appointment){
			throw new AppError(404,"appointment not found")
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