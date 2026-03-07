import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Provider from "../models/Provider.js";

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // token valid for 7 days
  );
};


// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role, city, phone } = req.body;

    // 1. Check all required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // 2. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user in DB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      city,
      phone,
    });

    // 5. If role is provider — create empty provider profile
    if (role === "provider") {
      await Provider.create({
        user: user._id,
        price: 0,
        city: city || "",
      });
    }

    // 6. Generate token
    const token = generateToken(user._id, user.role);

    // 7. Send response
    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password" });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 4. Generate token
    const token = generateToken(user._id, user.role);

    // 5. Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/auth/profile
// @access  Private (needs token)
export const getProfile = async (req, res) => {
  try {
    // req.user comes from auth middleware
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });

  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/auth/profile
// @access  Private (needs token)
export const updateProfile = async (req, res) => {
  try {
    const { name, city, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, city, phone },
      { new: true } // return updated user
    ).select("-password");

    res.status(200).json({
      message: "Profile updated",
      user,
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};