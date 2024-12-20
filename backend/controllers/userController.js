import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt, {genSalt} from "bcrypt";
import validator from "validator";

//create token

const createToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET);
};

// login user

const loginUser = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await userModel.findOne({email});
    if (!user) {
      return res.json({success: false, message: "User not found"});
    }

    // checking password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({success: false, message: "Invalide credentials "});
    }

    const token = createToken(user._id);
    return res.json({success: true, token: token});
  } catch (error) {
    return res.json({success: false, message: "Error in login"});
  }
};

//register user
const registerUser = async (req, res) => {
  const {name, email, password} = req.body;
  try {
    const exists = await userModel.findOne({email});
    if (exists) {
      return res.json({success: false, message: "User already registered"});
    }

    // validating email and password
    if (!validator.isEmail(email)) {
      return res.json({success: false, message: "Please enter a valid email"});
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    //password encryption

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    console.log(newUser);
    const user = await newUser.save();
    console.log(user);
    const token = createToken(user._id);

    return res.json({success: true, token: token});
  } catch (err) {
    return res.json({
      success: false,
      message: "There is error in registering user",
    });
  }
};

export {loginUser, registerUser};
