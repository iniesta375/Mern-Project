const nodemailer = require('nodemailer');
const cron       = require('node-cron');
const Medication = require('../models/Medication.js');
const AdherenceLog = require('../models/AdherenceLog.js');
const User       = require('../models/User.js');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});

const reminderEmailHTML = ({ userName, medName, dosage, time }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Medication Reminder</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#16a34a;padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">MediWell</h1>
              <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">Medication Reminder</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#1e293b;font-size:16px;margin:0 0 8px;">Hello <strong>${userName}</strong>,</p>
              <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 28px;">
                This is a reminder to take your medication. Here are the details:
              </p>

              <!-- Med card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#16a34a;">Medication</p>
                    <p style="margin:0 0 16px;font-size:22px;font-weight:700;color:#1e293b;">${medName}</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:50%;">
                          <p style="margin:0 0 2px;font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;">Dosage</p>
                          <p style="margin:0;font-size:15px;font-weight:600;color:#1e293b;">${dosage}</p>
                        </td>
                        <td style="width:50%;">
                          <p style="margin:0 0 2px;font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;">Scheduled Time</p>
                          <p style="margin:0;font-size:15px;font-weight:600;color:#1e293b;">${time}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 28px;">
                Please take your medication as prescribed. Consistent adherence is key to managing your health effectively.
              </p>

              <!-- CTA button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="http://localhost:5173/dashboard"
                       style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:700;">
                      Mark as Taken →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} MediWell · Helping Nigerians stay healthy<br>
                You received this because you enabled email reminders in your MediWell account.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const missedDoseEmailHTML = ({ userName, medName, dosage, time }) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#dc2626;padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">⚠️ MediWell</h1>
              <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">Missed Dose Alert</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="color:#1e293b;font-size:16px;margin:0 0 8px;">Hello <strong>${userName}</strong>,</p>
              <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 24px;">
                It looks like you missed your <strong>${medName} (${dosage})</strong> dose scheduled for <strong>${time}</strong> today.
              </p>
              <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 28px;">
                Please consult your doctor or pharmacist if you are unsure whether to take a missed dose.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="http://localhost:5173/dashboard"
                       style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:700;">
                      View Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} MediWell</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"MediWell" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

const checkAndSendReminders = async () => {
  try {
    const now     = new Date();
    const today   = now.toISOString().split('T')[0];
    const hour    = String(now.getHours()).padStart(2, '0');
    const minute  = String(now.getMinutes()).padStart(2, '0');
    const nowTime = `${hour}:${minute}`;

    const medications = await Medication.find({ active: true });

    for (const med of medications) {
      for (const scheduledTime of med.times) {

        const [h, m]       = scheduledTime.split(':').map(Number);
        const scheduledDate = new Date();
        scheduledDate.setHours(h, m, 0, 0);
        const diffMins = (scheduledDate - now) / 60000;

        if (diffMins > 0 && diffMins <= 15) {
          const alreadySent = await AdherenceLog.findOne({
            userId:        med.userId,
            medicationId:  med._id,
            scheduledTime: `${today} ${scheduledTime}`,
            status:        'reminder_sent',
          });

          if (!alreadySent) {
            const user = await User.findById(med.userId);
            if (user?.email && user?.preferences?.pushNotifications !== false) {
              await sendEmail({
                to:      user.email,
                subject: `💊 Reminder: Take ${med.name} at ${scheduledTime}`,
                html:    reminderEmailHTML({
                  userName: user.fullName?.split(' ')[0] || 'there',
                  medName:  med.name,
                  dosage:   med.dosage,
                  time:     scheduledTime,
                }),
              });

              await AdherenceLog.create({
                userId:        med.userId,
                medicationId:  med._id,
                scheduledTime: `${today} ${scheduledTime}`,
                status:        'reminder_sent',
                loggedAt:      new Date(),
              });

              console.log(`✉ Reminder sent to ${user.email} for ${med.name} at ${scheduledTime}`);
            }
          }
        }

        if (diffMins < -30) {
          const isTaken = await AdherenceLog.findOne({
            userId:        med.userId,
            medicationId:  med._id,
            scheduledTime: `${today} ${scheduledTime}`,
            status:        'taken',
          });

          const missedAlertSent = await AdherenceLog.findOne({
            userId:        med.userId,
            medicationId:  med._id,
            scheduledTime: `${today} ${scheduledTime}`,
            status:        'missed_alert_sent',
          });

          if (!isTaken && !missedAlertSent) {
            const user = await User.findById(med.userId);
            if (user?.email && user?.preferences?.pushNotifications !== false) {
              await sendEmail({
                to:      user.email,
                subject: `⚠️ Missed dose: ${med.name} was due at ${scheduledTime}`,
                html:    missedDoseEmailHTML({
                  userName: user.fullName?.split(' ')[0] || 'there',
                  medName:  med.name,
                  dosage:   med.dosage,
                  time:     scheduledTime,
                }),
              });

              await AdherenceLog.create({
                userId:        med.userId,
                medicationId:  med._id,
                scheduledTime: `${today} ${scheduledTime}`,
                status:        'missed_alert_sent',
                loggedAt:      new Date(),
              });

              console.log(`⚠ Missed dose alert sent to ${user.email} for ${med.name}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Notification scheduler error:', error);
  }
};

const startNotificationScheduler = () => {
  cron.schedule('* * * * *', checkAndSendReminders);
  console.log(' Notification scheduler started — checking every minute');
};

const sendReminders = async (req, res) => {
  try {
    await checkAndSendReminders();
    res.json({ success: true, message: 'Reminder check completed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send reminders' });
  }
};

module.exports = { startNotificationScheduler, sendReminders };