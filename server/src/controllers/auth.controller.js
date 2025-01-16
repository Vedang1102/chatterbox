import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req,res) => {
    const {email,fullName,password} = req.body;
    try {// hash password using bcryptjs
        if(!email || !fullName || !password) {
            return res.status(400).json({message: "All fields are required"});
        }
        if(password.length < 6 ) {
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }

        const user = await User.findOne({email});

        if(user) {
            return res.status(400).json({message: "Email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword
        });

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePicture: newUser.profilePicture});
        } else {
            res.status(400).json({message: "Invalid user data"});
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const login = async (req,res) => {
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isCorrectPass = await bcrypt.compare(password, user.password);
        if(!isCorrectPass) {
            return res.status(400).json({message: "Invalid credentials"});
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePicture: user.profilePicture
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const logout = (req,res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const updateProfile = async (req,res) => {
    try {
        const user = await User.findById(req.user._id);
        if(user) {
            user.profilePicture = req.body.profilePicture || user.profilePicture;
            await user.save();
            res.status(200).json({
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                profilePicture: user.profilePicture
            });
        } else {
            res.status(404).json({message: "User not found"});
        }
    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}