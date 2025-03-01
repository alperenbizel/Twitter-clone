import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
export const signup=async (req,res)=>{
   try {
    const {fullname,username,email,password}=req.body;
// const emailRegex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// if(emailRegex.test(email)){
//     return res.status(400).json({error:"Invalid Email"});
// }
const existingUser= await User.findOne({username});
if(existingUser){
    return res.status(400).json({error:"Username already exists"});
}
const existingEmail= await User.findOne({email});
if(existingEmail){
    return res.status(400).json({error:"Email already exists"});
}
const salt =await bcrypt.genSalt(10);
const hashedPassport =await bcrypt.hash(password,salt);

const newUser= new User({
    fullname,
    username,
    email,
    password:hashedPassport,
})
if(newUser){
    generateTokenAndSetCookie(newUser._id,res);
 
    res.status(201).json({
        _id:newUser._id,
        username:newUser.username, 
        email:newUser.email,
        fullname:newUser.fullname,
        followers:newUser.followers,
        followings:newUser.following,
        profileImg:newUser.profileImg,
        coverImg:newUser.coverImg,
    });
    await newUser.save();
}
else{
    res.status(400).json({error:"Invalid User Data"});
}
   } catch (error) {
         console.log("Error in signUp controller",error);
    res.status(500).json({error:"Internal Server Error"});
   }
}
export const login =async (req,res)=>{
   try {
    const {username,password} =req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
    const user=await User.findOne({username});
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
    if(!user || !isPasswordCorrect){
        return res.status(400).json({error:"Invalid username or Passport"});
    }
    generateTokenAndSetCookie(user._id,res);
    res.status(200).json({
        _id: user._id,
			fullName: user.fullname,
			username: user.username,
			email: user.email,
			followers: user.followers,
			following: user.following,
			profileImg: user.profileImg,
			coverImg: user.coverImg,
    })
   } catch (error) {
    console.log("Error in login controller", error);
		res.status(500).json({ error: "Internal Server Error" });
   }
}
export const logout=async (req,res)=>{
   try {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Logout Successfully"});
   } catch (error) {
    console.log("Error in logout controller", error);
		res.status(500).json({ error: "Internal Server Error" });
   }
}

export const getme=async (req,res)=>{
try {
    const user=await UserFinfById(req.userId).select("-password");
    res.status(200).json(user);
} catch (error) {
    console.log("Error in getMe controller", error);
		res.status(500).json({ error: "Internal Server Error" });
}
}