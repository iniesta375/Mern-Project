const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const admin    = require('firebase-admin');
require('dotenv').config();

const routes = require('./routes/api.js');
const { startNotificationScheduler } = require('./controllers/notificationController.js');

const app  = express();
const PORT = process.env.PORT || 5000;

const https = require('https');
const keepAlive = () => {
  const url = process.env.RENDER_URL;
  if (url) {
    https.get(`${url}/health`, (res) => {
      console.log(`🔔 Keep-alive ping: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error('Keep-alive error:', err.message);
    });
  }
};
setInterval(keepAlive, 14 * 60 * 1000); 
// const serviceAccount = require('./serviceAccountKey.json');
let serviceAccount;

if (process.env.NODE_ENV === 'production') {
  serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
} else {
  serviceAccount = require('./serviceAccountKey.json');
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
console.log('Firebase Admin initialised');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://mern-project-sigma-umber.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediwell')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      startNotificationScheduler();
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
