const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async(req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if(!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successfull", token });
    }
    catch(error){
        res.status(500).json({ message: "Error logging in", error });
    }
};

exports.signup = async (req, res) => {
    try {
        console.log("Received request body:", req.body);  // ✅ Debugging

        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Error signing up", error: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "name", "email", "role"] // Exclude password for security
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

exports.addMember = async(req, res) => {
    try{
        if(req.user.role !== "Admin") {
            return res.status(403).json({ message: "Only admins can create Projects" });
        }
        const {name, email, password, role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword, role });
        res.status(201).json({ message: "Member added successfully", user });
    }
    catch(error){
        res.status(500).json({ message: "Error adding member", error: error.message });
    }
};

exports.deleteMember = async(req, res) => {
    try{
        if(req.user.role !== "Admin") {
            return res.status(403).json({ message: "Only admins can create Projects" });
        }
        const userId = req.params.id;
        const member = await User.findByPk(userId);
        
        if(!member){
            return res.status(404).json({ message: "Member not found" });
        }
        await member.destroy();
        res.status(200).json({ message: "Member deletd successfully" });
    }
    catch(error){
        res.status(500).json({ message: "Error deleting member", error: error.message });
    }
};

