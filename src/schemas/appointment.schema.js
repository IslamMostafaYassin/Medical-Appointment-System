const {z}=require("zod")

const createAppointmentSchema=z.object({
	doctorId: z.string().min(1, "Doctor ID is required"),
  	date: z.string().datetime({
    message: "Invalid date format. Please send a valid ISO date string (e.g., 2026-08-03T11:30:00Z)",
  })
})

module.exports={createAppointmentSchema}