const dotenv=require("dotenv")
dotenv.config()
const express=require("express")
const cors=require("cors")
const morgan=require("morgan")
const cookieParser=require("cookie-parser")
const swaggerUI = require("swagger-ui-express")

const connectDB=require("./config/db.config.js")
const globalErrorHandler=require("./middleware/error.middleware.js")
const authRouter=require("./routes/auth.routes.js")
const adminRouter=require("./routes/admin.routes.js")
const appointmentRouter=require("./routes/appointment.routes.js")
const specs=require("./config/swagger.config.js")



const app=express()
connectDB()

app.use(cors({
  credentials: true,
}));
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

app.get("/api/v1",(req,res)=>{
	res.send("welcome to my Medical Appointment System!")
})

app.use("/api/v1/api-docs",swaggerUI.serve,swaggerUI.setup(specs))
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/appointments",appointmentRouter)
app.use("/api/v1/admin",adminRouter)

app.use(globalErrorHandler)

const PORT=process.env.PORT

app.listen(PORT,()=>{
	console.log("listening on port "+PORT)
})