const {z}=require("zod")

const registerSchema=z.object({
	username:z
		.string()
		.trim()
		.toLowerCase()
		.min(3,"username must be at least 3 characters long"),
	email:z.string().trim().toLowerCase().email("Invalid email address"),
	password:z.string().min(8,"password must be at least 8 characters long"),
	role: z.enum(["patient", "doctor"]).optional(),
	specialization: z.string().trim().optional(),
})

const loginSchema=z.object({
	email:z.string().trim().toLowerCase().email("Invalid email address"),
	password:z.string().min(1,"password is required")
})


module.exports={registerSchema,loginSchema}