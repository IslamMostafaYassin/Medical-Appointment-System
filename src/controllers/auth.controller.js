	const User=require('../models/user.model.js')
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const AppError=require("../utils/AppError.js")

const TOKEN_EXPIRATION_TIME="10m"
const COOKIE_OPTIONS={
			maxAge:10*60*1000,
			httpOnly:true,
			secure:process.env.NODE_ENV === 'production'
		}

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: ali
 *               email:
 *                 type: string
 *                 example: ali@gmail.com
 *               password:
 *                 type: string
 *                 example: myveryhardpassword
 *               role:
 *                 type: string
 *                 enum: [patient, doctor, admin]
 *                 default: patient
 *               specialization:
 *                 type: string
 *                 description: only required if role is doctor
 *                 example: cardiology
 *     responses:
 *       201:
 *         description: registration successful
 *       400:
 *         description: missing fields or user already exists
 */
const register=async(req,res,next)=>{
	try{
		const {username,email,password,role,}=req.body;
		let {specialization}=req.body
		const hashedPassword=await bcrypt.hash(password,10)
		if (role!=="doctor"){
			specialization=undefined;
		}
		const user=await User.create({
			username,
			email,
			role,
			specialization,
			password:hashedPassword
		})
		const token=jwt.sign({
			userId:user._id,
			role:user.role
		},
		process.env.JWT_SECRET,{
			expiresIn:TOKEN_EXPIRATION_TIME
		})
		user.password=undefined

		res.cookie("jwt",token,COOKIE_OPTIONS)
		return res.status(201).send({
			success:true,
			message:"registration successful",
			user
		})

	}catch(err){
		next(err)
	}
}

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: log in to an account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: ahmed@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: login successful
 *       400:
 *         description: invalid credentials
 */
const login=async(req,res,next)=>{
	try{
		const {email,password}=req.body
		const existingUser=await User.findOne({email})
		if (!existingUser){
			throw new AppError(400,"invalid credentials")
		}
		const validPassword=await bcrypt.compare(password,existingUser.password)
		if (!validPassword){
			throw new AppError(400,"invalid credentials")
		}

		const token=jwt.sign({
			userId:existingUser._id,
			role:existingUser.role
		},process.env.JWT_SECRET,{
			expiresIn:TOKEN_EXPIRATION_TIME
		})

		res.cookie("jwt",token,COOKIE_OPTIONS)

		return res.send({
			success:true,
			message:"login successful",
		})
	}catch(err){
		next(err)
	}
}

/**
 * @swagger
 * /api/v1/auth/logout:
 *   get:
 *     summary: log out current user and clear JWT cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: signout successful
 */
const logout=(req,res)=>{
	res.clearCookie("jwt",COOKIE_OPTIONS)

	return res.send({
		success:true,
		message:"signout successful"
	})
}

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: get data of logged in user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: user data returned successfully
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
 */
const getCurrentUser=async(req,res,next)=>{
	try{
		const user=await User.findOne({_id:req.user.userId}).select("-password")
		return res.send({
			success:true,
			data:user
		})
	}catch(err){
		next(err);
	}

}


module.exports={register,login,logout,getCurrentUser}