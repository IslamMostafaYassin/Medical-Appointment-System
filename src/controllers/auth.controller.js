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

const logout=(req,res)=>{
	res.clearCookie("jwt",COOKIE_OPTIONS)

	return res.send({
		success:true,
		message:"signout successful"
	})
}

const getCurrentUser=async(req,res,next)=>{
	try{
		const user=await User.findOne({_id:req.user.userId}).select("-password")
		const {username,email,role,specialization}=user;
		return res.send({
			success:true,
			data:user
		})
	}catch(err){
		next(err);
	}

}


module.exports={register,login,logout,getCurrentUser}