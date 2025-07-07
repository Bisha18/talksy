import { generateToken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
export const signup = async(req, res) => {
   const {fullName,email,password} = req.body
   try {

      if(!fullName || !email || !password){
         return res.status(400).json({message:"All fields are required"})
      }

      if(password.length<6){
         return res.status(400).json({message:"Password must be at least 6 characters long"})
      }

      const user = await User.findOne({email});
      if(user){
         return res.status(400).json({message:"User already exists"})
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password,salt);

      const newUser = new User({
         fullName,
         email,
         password:hashedPassword
      })

      if(newUser){
        generateToken(newUser._id,res)
        await newUser.save()
        return res.status(201).json({message:"User created successfully"},newUser)
      }else{
        return res.status(400).json({message:"User not created"})
      }

   } catch (error) {
      console.log(error);
      return res.status(500).json({message:"Something went wrong"})
   }
};

export const login = async(req, res) => {
  const {email,password} = req.body
  try{
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({message:"User not found"})
    }
    
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
      return res.status(400).json({message:"Password is incorrect"})
    }

    generateToken(user._id,res)
    return res.status(200).json({message:"User logged in successfully"})

  }catch(error){
    console.log(error);
    return res.status(500).json({message:"Something went wrong"})
  }
};

export const logout = (req, res) => {
  try{
    res.cookie("jwt","",{httpOnly:true,maxAge:0,sameSite:"strict",secure:process.env.NODE_ENV==="production"});
    return res.status(200).json({message:"User logged out successfully"})
  }catch(error){
    console.log(error);
    return res.status(500).json({message:"Something went wrong"})
  }
};  