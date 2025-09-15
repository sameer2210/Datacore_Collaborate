import express from "express";
import sendEmail from "../../dataEntryMiddle/sendMail.js";
import AWS from "aws-sdk";
import multer from "multer";
import path from "path";
import User from "../models/cra/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();

AWS.config.update({
	region: process.env.AWS_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


// Multer storage config
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/'),
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		cb(null, `${Date.now()}${ext}`);
	}
});

const upload = multer({ storage });

// API to upload name + profile pic
router.post('/upload', upload.single('profilePic'), async (req, res) => {
	const { name } = req.body;
	const userId = req.body.id;
	const profilePic = req.file?.filename;

	if (!userId || (!name && !profilePic)) {
		return res.status(400).json({ error: 'Missing user ID or data to update' });
	}

	try {
		const updateData = {};
		if (name) updateData.name = name;
		if (profilePic) updateData.profilePic = profilePic;

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ $set: updateData },
			{ new: true }
		);
		res.json({ message: 'User saved successfully', data: updatedUser });
	} catch (err) {
		res.status(500).json({ error: 'Failed to save user', details: err.message });
	}
});

// API to upload name + profile


router.post('/set-password', async (req, res) => {
	try {
		const { password, id } = req.body;
		console.log(req.body);
		

		if (!id || !password) {
			return res.status(400).json({ error: 'Missing user ID or password' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const updatedUser = await User.findByIdAndUpdate(id,
			{ $set: { password: hashedPassword } },
			{ new: true }
		);

		if (!updatedUser) {
			return res.status(404).json({ error: 'User not found' });
		}
		
		

		const token = jwt.sign(
			{ id: updatedUser._id },
			process.env.TOKEN_SECRET,
			{ expiresIn: '1d' }
		);
     
		res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

		res.json({
			message: 'Password saved successfully',
			data: updatedUser
		});

	} catch (err) {
		console.error("Set Password Error:", err);
		res.status(500).json({ error: 'Failed to save user', details: err.message });
	}
});




function generateOTP(length = 6) {
	return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}


router.get("/", async (req, res) => {
	try {
		if (!req.query.id) {
			return res.status(400).send({ error: "AdminId missing" });
		}
		const certificates = await Certificate.find();
		res.status(200).json(certificates);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/:id", async (req, res) => {
	try {
		if (!req.query.id) {
			return res.status(400).send({ error: "AdminId missing" });
		}
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ error: "Certificate Id missing" });
		}
		const certificate = await Certificate.findById(id);
		res.status(200).json(certificate);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/number/:id", async (req, res) => {
	try {
		if (!req.query.id) {
			return res.status(400).send({ error: "AdminId missing" });
		}
		const { id } = req.params;
		if (!id) {
			return res
				.status(400)
				.json({ error: "Certificate number missing" });
		}
		const certificate = await Certificate.findOne({
			certificate_number: id,
		});
		res.status(200).json(certificate);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post("/", async (req, res) => {
	try {
		if (!req.query.id) {
			return res.status(400).send({ error: "AdminId missing" });
		}
		const {
			issued_date,
			first_name,
			last_name,
			training,
			training_name,
			training_period_start,
			training_period_end,
			trainer_name,
			trainer_signature,
			training_validity,
		} = req.body;
		const certificate = await Certificate.create({
			certificate_number: makeid(),
			issued_date,
			first_name,
			last_name,
			training,
			training_name,
			training_period_start,
			training_period_end,
			trainer_name,
			trainer_signature,
			training_validity,
		});
		if (certificate) {
			res.status(200).json(certificate);
		} else res.status(400).json({ error: "Unable to create certificate." });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.message });
	}
});

router.post(
	"/upload-logo",
	upload.single("logo"),
	async (req, res) => {
		try {
			if (!req.query.id) {
				return res.status(400).send({ error: "AdminId missing" });
			}
			res.status(200).json({ key: req.file.key });
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: err.message });
		}
	}
);

router.post("/send-email", async (req, res) => {
	try {
		console.log(req.body);
		const { email } = req.body;
		console.log(email);

		if (!email?.length) {
			return res.status(400).json({ error: "Email missing" });
		}

		const from = process.env.SENDER_VERIFIED_EMAIL;
		const otp = generateOTP(6);
		const subject = "Your OTP for GE3S Platform Onboarding";

		const body = `Dear ${email}, Welcome to the GE3S Platform!
To complete your onboarding process, please use the One-Time Password (OTP) provided below. This code is valid for the next 10 minutes: Your OTP: ${otp}. Best regards, GE3S`;

		const html = `Dear ${email},<br /><br />Welcome to the GE3S Platform! <br/>
To complete your onboarding process, please use the One-Time Password (OTP) provided below. This code is valid for the next 10 minutes:<br><br><strong>Your OTP: ${otp}</strong>.<br/><br/>Best regards,<br />GE3S`;

		const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

		const user = await User.findOneAndUpdate(
			{ email },
			{ email, otp },
			{ upsert: true, new: true }
		);
		console.log(user);
		

		// No need to save again — findOneAndUpdate already does it
		// But if you're paranoid, you can still safely do:
		// await user.save();

		const emailSent = await sendEmail(email, from, subject, body, html);

		if (emailSent) {
			return res.status(200).json({
				message: "OTP sent successfully",
				otp, // ⚠️ Remove in production
				id: user._id,
			});
		} else {
			return res.status(500).json({ error: "Unable to send email." });
		}

	} catch (err) {
		console.error("Error in /send-email:", err);
		return res.status(500).json({ error: err.message });
	}
});


router.post('/verify-otp', async (req, res) => {
	const { email, otp } = req.body;
console.log(req.body);
	const user = await User.findOne({ email });
	if (!user) return res.status(400).json({ error: 'User not found' });

	// if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });
   console.log(user.otp);
	if (user.otp !== otp) {
		return res.status(400).json({ error: 'Invalid or expired OTP' });
	}

	// OTP correct, mark user as verified
	user.isVerified = true;
	user.otp = undefined;
	user.otpExpiresAt = undefined;
	await user.save();

	// Send only user ID to frontend
	res.status(200).json({
		message: 'Email verified successfully',
		userId: user._id,
	});
});


router.post("/delete", async (req, res) => {
	try {
		if (!req.query.id) {
			return res.status(400).send({ error: "AdminId missing" });
		}
		const { certificate_id } = req.body;
		if (!certificate_id?.length) {
			return res.status(400).json({ error: "Id missing" });
		}
		if (await Certificate.deleteOne({ _id: certificate_id })) {
			res.status(200).json({});
		} else {
			res.status(400).json({ error: "Unable to delete certificate." });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.message });
	}
});

router.post("/:id", upload.single("trainer_signature"), async (req, res) => {
	try {
		if (!req.query.id) {
			return res.status(400).send({ error: "AdminId missing" });
		}
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ error: "Certificate Id missing" });
		}
		const {
			issued_date,
			first_name,
			last_name,
			training,
			training_name,
			training_period_start,
			training_period_end,
			trainer_name,
			trainer_signature,
			training_validity,
		} = req.body;
		const certificate = await Certificate.findByIdAndUpdate(
			id,
			{
				issued_date,
				first_name,
				last_name,
				training,
				training_name,
				training_period_start,
				training_period_end,
				trainer_name,
				trainer_signature,
				training_validity,
			},
			{ new: true }
		);
		if (certificate) res.status(200).json(certificate);
		else res.status(400).json({ error: "Unable to update certificate." });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});








export default router;





