import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req,res) => {
    const {email,fullName,password} = req.body;
    try {// hash password using bcryptjs
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
            await newUser.save();
            res.status(201).json({message: "User created successfully"});
        } else {
            res.status(400).json({message: "Invalid user data"});
        }

    } catch (error) {
        
    }
}

export const login = (req,res) => {
    res.send("Login Page");
}

export const logout = (req,res) => {
    res.send("Logout Page");
}