import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

/**
 * Forgot Password Controller
 */
export const forgotPassword = async (req, res) => {
  const {email} = req.body;

  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({success: false, message: "User not found"});
    }

    // Generate JWT Reset Token
    const resetToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // Create Reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    // Send Email
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res
      .status(200)
      .json({success: true, message: "Password reset email sent."});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: "Server error."});
  }
};

export const resetPassword = async (req, res) => {
  const {token, password} = req.body;

  console.log("Token:", token);
  console.log("Password:", password);
  try {
    // Validate and decode the token (assuming JWT token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: "User not found."});
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({message: "Password reset successful."});
  } catch (error) {
    console.error("Error resetting password:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({message: "Invalid or expired token."});
    }
    return res.status(500).json({message: "Error resetting password."});
  }
};
