const {z}=require("zod")

const createAppointmentSchema=z.object({
	doctorId: z.string().min(1, "Doctor ID is required"),
  	date: z.string()
		  	.datetime({
		  	 local: true ,
		  	 message: "Invalid date format."
		  	}),
})

module.exports={createAppointmentSchema}