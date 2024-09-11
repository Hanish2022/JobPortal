import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {
        console.log(req.body);
        const { fullname, email, phoneNumber, role ,password} = req.body
        if (!fullname || !email || !phoneNumber || !role || !password) {
            return res.status(400).json({
                message: "something is missing ",
                success:false
            })
        }
        console.log(1);
        //check if user exists already
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "user with this mail already exists",
                success:false
            })
        }
        //hash pass
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        })
        console.log("REGISTERED");
        console.log(req.body);
         return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log("user not registed",error)
    }
}


export const login = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password, role } = req.body;
        if (!password || !email || !role) {
            return res.status(400).json({
                message: "something is missing",
                success:false
            })
        }
        //check if this user registered or not
        let user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({
                    message: "incorrect mail or pass",
                    success:false
            })
        }
        //check pass matched current passs with that pass jiske sath tumne regsiter krs tha
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
             return res
                .status(400)
                .json({
                    message: "incorrect mail or pass",
                    success:false
            })
        }
        //check role is correct or not...manlo acc create kra tha as a recruiter and login kr rha h as a viewer
        if (role != user.role) {
            return res
                .status(400)
                .json({
                    message: "Account does not matched with current role",
                    success:false
            })
        }

        //generatr token for authentication
        const tokenData = {
            userId:user._id
        }
        const token = await jwt.sign(
            tokenData,
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );
        //seidning user in json return res while login is good practice we removed senstive info like pass etc
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile:user.profile,
        }
        //cookies me store token
        return res
            .status(200)
            .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' })
            .json({
                message: `Welcome back ${user.fullname}`,
                user,
                success:true
        })

    } catch (error) {
        console.log(req.body);
        console.log("login not done",error);
    }
}

export const logout =async (req, res) => {
    try {
        return res
            .status(200)
            .cookie("token", "", { maxAge: 0 })//send empty token 
            .json({
                message: "Logged out successfully",
                success: true
       }) 
    } catch (error) {
        console.log("error is logging out",error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        if (!fullname || !email  || !phoneNumber || !bio || !skills) {
            return res.status(400).json({
                message: "something is missing",
                success:false
            })
        }
        //cloudinary ayega idhr

        //skills string me h array me cpnvert kro
        const skillsArray = skills.split(",");
        //update krne se pehle login check kro
        const userId = req.id;//middleware se aayega
        let user = await User.findById(userId);
        if (!user) {
            return res
                .status(400)
                .json({
                    message: "User not found please login first to updatye",
                    success:false
            })
            
        }
        //updating data
        user.fullname = fullname,
            user.email = email,
            user.phoneNumber = phoneNumber,
            user.profile.bio = bio,
            user.profile.skills = skillsArray,

            
        //resume ayega idhr
            
            
            await user.save();
        
             user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile:user.profile,
        }
        return res
            .status(200)
            .json({
                message: "Proflie updated successflyy",
                user,
                success:true
        })
        
    } catch (error) {
        console.log("error in updating user profile",error);
    }
}