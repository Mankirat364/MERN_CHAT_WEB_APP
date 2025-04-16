import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import cloudinary from '../lib/cloudinary.js'
export const signupRoute = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({
                message : "All Fields are required"
            })
        }
        if(password.length < 6) {
            return res.status(400).json({
                messsage : "Password must be atleast 6 characters"
            })
        }

        const user = await User.findOne({email})
        if(user) return res.status(400).json({messsage  : "user already exist"})

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = await User.create({
            fullName,
            email,
           password : hashedPassword
        })
        if(newUser){
            generateToken(newUser._id,res)
            res.status(201).json({
                newUser,
                message : "User Created Successfully"
            })
        }else{
    res.status(400).json({
        message : "invalid user data"
    })
        }
    } catch (error) {
        console.log("Error in signup controller", error.message)
    }
}
export const loginRoute = async (req, res) => {
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message : "Invalid Credentials"
            })

        }
       const isPasswordMatch =  await bcrypt.compare(password,user.password)
       if(!isPasswordMatch){
        return res.status(400).json({
            message : "Invalid Credentials"
        })
       }
       generateToken(user._id,res)
       res.status(200).json({
        user,
        message : "User successfully logged in"
       })
    } catch (error) {
        console.log("Error in loggin Controller",error.message)   
    }
}
export const deleteRoute = async (req, res) => {
    try {
        res.cookie("jwt","",{maxAge : 0})
        res.status(200).json({
            message : "Logged out successfully"
        })
    } catch (error) {
        console.log("Error in logout controller",error.message)
    }
}
export const updateRoute = async (req,res)=>{
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic){
            return res.status(400).json({
                message : 'Profile pic is requried',
            })
        }
     const uploadResponse =  await cloudinary.uploader.upload(profilePic)
     const updatedUser = await User.findByIdAndUpdate(userId,{profilePic :uploadResponse.secure_url},{new:true})

     res.status(200).json(updatedUser)
    } catch (error) { 
        console.log("Error in updating the profile", error)
        res.status(500).json({
            message : "Internal server error"
        })
    }
}
export const checkRoute = async(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message : "Internal server errro"
        })
    }
}