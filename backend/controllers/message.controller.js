import User from "../models/user.model.js";
import Message from '../models/message.model.js'
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";
export const getUsersForSidebar = async(req,res) =>{
try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({_id : {$ne : loggedInUserId}}).select("-password");
    res.status(200).json(filteredUsers)
} catch (error) {
    console.log("Error in gettingUsersForSidebar",error.message);
    res.status(500).json({
        message : "INternal server errro"
    })
}
}
export const getMessage = async(req,res)=>{
try {
    const {id:userToChatId} = req.params
    const senderId = req.user._id;
    const messages = await Message.find(
        {
            $or:[
                {senderId:senderId,receiverId : userToChatId},
                {senderId : userToChatId, receiverId : senderId}
            ]
        }
    )
    res.status(200).json({
        messages
    })
} catch (error) {
     console.log("error while fetching the messages")
     res.status(500).json("internal server error")
}
}
export const sendMessage = async(req,res)=>{
    try {
        const{text,image} = req.body;
        const {id : receiverId} = req.params
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image : imageUrl
        })
    const receiverSocketId = getRecieverSocketId(receiverId) 
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage)
    }  
        res.status(201).json({
            newMessage,
            message : "message created successfully"
        })
    } catch (error) {
        console.log("error in creating the message", error.message)
        res.status(500).json("internal server error")
    }
}