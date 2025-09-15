import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LocalStorage } from "node-localstorage";
import Admin from "../models/cra/user.js"; // Make sure the model file has `.js` extension when using ESM
import { adminonly, protect } from "../../dataEntryMiddle/authMiddleware.js";

const router = express.Router();

// Setting up local storage
const store = new LocalStorage("./localStorage");

//  Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

   
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

 
    const preUsers = await Admin.findOne({ email });
    if (preUsers) {
      return res.status(400).json({ error: "Email already exists" });
    }

  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({
      name,                   
      email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    res.json({
      message: "Admin registered successfully",
      admin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Invalid details" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "No such admin exists" });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
  {
    id: admin._id,
    role: admin.role,
    email: admin.email
  },
  process.env.TOKEN_SECRET,
  { expiresIn: "1d" }
);

    store.setItem(token, admin._id);

    res.json({
      message: "Admin logged in successfully",
      token,
      admin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  Logout Route
router.post("/logout", async (req, res) => {
  try {
    const { token, id } = req.body;
    if (!token || !id) {
      return res.status(400).json({ error: "Token or AdminId Missing" });
    }

    if (store.getItem(token) !== id) {
      return res.status(400).json({ error: "Invalid token" });
    }

    store.removeItem(token);
    return res.json({ message: "Admin logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post("/changePassword", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    // Validate input
    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ error: "Incomplete Data" });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "No such admin exists" });
    }

    // Check old password
    const validPassword = await bcrypt.compare(oldPassword, admin.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid old password" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


//  Forgot Password Route
router.post("/forgetPassword", async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).send({ error: "Email missing" });
    }

    const { email, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedAdmin = await Admin.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).send({ error: "Admin not found" });
    }

    return res.send({
      message: "Password changed successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
});




// 🟢 Get Profile Route
router.get("/profile", protect,adminonly, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password"); // password hide
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json({ admin });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




export default router;
