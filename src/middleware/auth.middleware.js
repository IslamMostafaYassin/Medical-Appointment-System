const AppError=require("../utils/AppError.js")
const jwt=require("jsonwebtoken")

const authenticate=(req,res,next)=>{
	try{
		let token;
		if (req.cookies){
			token=req.cookies.jwt
		}
		if (!token){
			throw new AppError(401,"invalid token")
		}
		req.user=jwt.verify(token,process.env.JWT_SECRET)
		next()
	}catch(err){
		next(err)
	}

}

const authorize=(req,res,next)=>{
	try{
		if(req.user.role!=="admin"){
			throw new AppError(403,"restricted endpoint. You must be an admin")
		}
		next()
	}catch(err){
		next(err)
	}
}



module.exports={authenticate,authorize}