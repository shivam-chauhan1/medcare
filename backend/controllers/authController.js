import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import { signupSchema, loginSchema } from "../utils/validator.js";

const JWT_SECRET = process.env.JWT_SECRET;

// function for jwt token creation
const createToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2d" });
};

// signup Controller
export const signup = async (req, res) => {
  try {
    // validate input first
    const { error } = signupSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const validationErrors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
      });
    }

    const { name, email, password, role } = req.body;

    // check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = new User({
      name,
      email,
      password_hashed: hashedPassword,
      role: role || "user",
    });

    const savedUser = await newUser.save();
    if (!savedUser) {
      return res.status(500).json({ message: "User not saved" });
    }

    // generate JWT Token
    console.log(savedUser);
    const token = createToken({
      user_id: savedUser.user_id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    // set token in HTTP cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// login Controller
export const login = async (req, res) => {
  try {
    // validate input first
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const validationErrors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
      });
    }

    const { email, password } = req.body;

    // find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // compare passwords
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hashed
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // generate JWT token
    const token = createToken({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // set token in HTTP cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// logout controller
export const logout = (req, res) => {
  // clear JWT cookie
  res.cookie("token", "", {
    maxAge: 1,
    httpOnly: true,
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export const checkAlreadyLoggedIn = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "User is already logged in",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const googleAuth = (req, res) => {
  const { user } = req;

  console.log(user);
  const token = jwt.sign(
    {
      user_id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });

  res.redirect("http://localhost:3001/doctors");
};
