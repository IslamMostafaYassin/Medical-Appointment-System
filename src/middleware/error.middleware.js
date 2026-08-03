const zod=require("zod")
const mongoose=require("mongoose")
const AppError=require("../utils/AppError.js")
const jwt=require("jsonwebtoken")

const globalErrorHandler=(err,req,res,next)=>{
	console.log("Error: ",err.message)
	let message="Internal server error"
	let statusCode=500
	if (err instanceof jwt.JsonWebTokenError){
		statusCode=401
		message="invalid token"

		return res.status(statusCode).send({
			success:false,
			message
		})
	}
	if (err instanceof zod.ZodError){
		statusCode=400
		if (err.errors[0])
			message=err.errors[0].message
		else
			message="Input validation error"

		return res.status(statusCode).send({
			success:false,
			message
		})
	}
	if (err instanceof mongoose.Error ){
		statusCode=400
		message="Database error"
		return res.status(statusCode).send({
			success:false,
			message
		})
	}
	if (err.code === 11000){
		statusCode=400
		message="one of the fields is already taken"
		return res.status(statusCode).send({
			success:false,
			message
		})
	}
	if (err instanceof AppError){
		statusCode=err.statusCode
		message=err.message
		return res.status(statusCode).send({
			success:false,
			message
		})
	}
	return res.status(statusCode).send({
		success:false,
		message
	})
}

module.exports=globalErrorHandler