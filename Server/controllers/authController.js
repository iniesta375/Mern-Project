const User       = require('../models/User.js');
const jwt        = require('jsonwebtoken');
const bcrypt     = require('bcryptjs');
const admin      = require('firebase-admin');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = makeToken(user);
    res.json({
      token,
      user: {
        id:       user._id,
        fullName: user.fullName,
        email:    user.email,
        phone:    user.phone,
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
}; const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login, googleLogin, me, updateProfile, updatePreferences, uploadAvatar, deleteAccount,};