import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./utils/db.js"
import userRoute from "./routes/user.route.js"
import companyRoute from "./routes/company.route.js"
import applicationRoute from "./routes/application.route.js"
import jobRoute  from "./routes/job.route.js"
dotenv.config({})
const app = express()

//injecting middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
const corsOption = {
   origin: 'http://localhost:5173',

  
    credentials: true,

}
app.use(cors(corsOption))

const PORT = process.env.PORT || 3000;
//api
app.use("/api/v1/users", userRoute)
app.use("/api/v1/company", companyRoute)
app.use("/api/v1/job", jobRoute)
app.use("/api/v1/application", applicationRoute)

//"http://localhost:3000/api/v1/user/register.."
app.listen(PORT, () => {
    connectDB()
    console.log(`server is running at ${PORT}`);
})