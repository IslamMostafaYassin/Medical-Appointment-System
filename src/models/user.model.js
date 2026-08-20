const mongoose=require("mongoose")

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: ahmed
 *         email:
 *           type: string
 *           example: ahmed@gmail.com
 *         password:
 *           type: string
 *           example: hardpassword
 *         role:
 *           type: string
 *           enum: [patient, doctor, admin]
 *           default: patient
 *           example: doctor
 *         specialization:
 *           type: string
 *           description: only required if role is doctor
 *           example: cardiology
 */
const userSchema=new mongoose.Schema({
		username:{
			type:String,
			required:true,
			unique:true,
		},
		email:{
			type:String,
			required:true,
			unique:true
		},
		password:{
			type:String,
			required:true,
		},
		role:{
			type:String,
			enum:["patient","doctor","admin"],
			default:"patient"
		},
		specialization:{
			type:String,
		}
	},
{
	timestamps:true
})

const userModel=mongoose.model("User",userSchema)

module.exports=userModel