const User       = require('../models/User.js');
const jwt        = require('jsonwebtoken');
const bcrypt     = require('bcryptjs');
const crypto     = require('crypto');
const nodemailer = require('nodemailer');
const admin      = require('firebase-admin');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const makeToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'your-secret-key-here'
  );

const register = async (req, res) => {
  const { fullName, email, password, phone } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword, phone });
    await user.save();

    const token = makeToken(user);
    res.json({ token, user: { id: user._id, fullName, email, phone } });
  } catch (error) {
    console.error('REGISTRATION ERROR:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    if (!user.password) {
      return res.status(400).json({
        error: 'This account uses Google Sign-In. Please use the Google button to sign in.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = makeToken(user);
    res.json({
      token,
      user: {
        id:        user._id,
        fullName:  user.fullName,
        email:     user.email,
        phone:     user.phone,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const googleLogin = async (req, res) => {
  const { idToken } = req.body;
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;

    let user = await User.findOne({ $or: [{ googleId: uid }, { email }] });

    if (!user) {
      user = new User({
        fullName:  name || email.split('@')[0],
        email,
        googleId:  uid,
        avatarUrl: picture || '',
        phone:     '',
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = uid;
      if (!user.avatarUrl && picture) user.avatarUrl = picture;
      await user.save();
    }

    const token = makeToken(user);
    res.json({
      token,
      user: {
        id:        user._id,
        fullName:  user.fullName,
        email:     user.email,
        phone:     user.phone,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error('GOOGLE LOGIN ERROR:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  const { fullName, phone } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, phone },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updatePreferences = async (req, res) => {
  const { pushNotifications, caregiverAlerts, weeklySummary } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences: { pushNotifications, caregiverAlerts, weeklySummary } },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder:         'mediwell/avatars',
          public_id:      `user_${req.user.id}`,
          overwrite:      true,
          transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarUrl: result.secure_url },
      { new: true }
    ).select('-password');

    res.json({ avatarUrl: user.avatarUrl });
  } catch (error) {
    console.error('AVATAR UPLOAD ERROR:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const forgotPassword = async (req, res) => {

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const token   = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken   = token;
    user.resetPasswordExpires = expires;
    await user.save();

    const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetURL  = `${clientURL}/reset-password?token=${token}`;

    const info = await transporter.sendMail({
      from:    `"MediWell" <${process.env.GMAIL_USER}>`,
      to:      user.email,
      subject: 'Reset your MediWell password',
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:520px;margin:0 auto;background:#f8fafc;padding:32px;border-radius:16px;">
          <div style="background:#059669;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
            <h1 style="color:white;margin:0;font-size:24px;font-weight:700;">💊 MediWell</h1>
          </div>
          <h2 style="color:#0f172a;font-size:20px;margin-bottom:8px;">Reset your password</h2>
          <p style="color:#475569;font-size:15px;line-height:1.6;margin-bottom:24px;">
            Hi <strong>${user.fullName.split(' ')[0]}</strong>, we received a request to reset your MediWell password.
            Click the button below to choose a new one.
          </p>
          <a href="${resetURL}"
             style="display:inline-block;background:#059669;color:white;text-decoration:none;
                    font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;margin-bottom:24px;">
            Reset Password
          </a>
          <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin-bottom:0;">
            This link expires in <strong>1 hour</strong>. If you didn&apos;t request a password reset,
            you can safely ignore this email — your account is secure.
          </p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
          <p style="color:#cbd5e1;font-size:12px;text-align:center;margin:0;">
            MediWell &mdash; Your trusted medication reminder
          </p>
        </div>
      `,
    });

    res.json({ message: 'If that email exists, a reset link has been sent.' });

  } catch (error) {
    console.error('❌ FORGOT PASSWORD ERROR:', error.message);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token and new password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken:   token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Reset link is invalid or has expired.' });
    }

    user.password             = await bcrypt.hash(password, 10);
    user.resetPasswordToken   = null;
    user.resetPasswordExpires = null;
    await user.save();

    console.log('✅ Password reset for:', user.email);
    res.json({ message: 'Password reset successfully. You can now log in.' });

  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  me,
  updateProfile,
  updatePreferences,
  uploadAvatar,
  deleteAccount,
  forgotPassword,
  resetPassword,
};