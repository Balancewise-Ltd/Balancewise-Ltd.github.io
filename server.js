/**
 * Balancewise Technologies — Node.js Server
 * Serves static files + handles API routes
 */
require('dotenv').config();
const express  = require('express');
const nodemailer = require('nodemailer');
const cors     = require('cors');
const helmet   = require('helmet');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: 'https://balancewises.io' }));
app.use(express.json());
app.use(express.static(__dirname));

// Serve HTML pages
const pages = ['index','services','staffing','ai','team','apply','contact'];
pages.forEach(p => {
  app.get(`/${p === 'index' ? '' : p}`, (req, res) =>
    res.sendFile(path.join(__dirname, `${p}.html`))
  );
});

// Mailer helper
async function sendMail(subject, html) {
  if (!process.env.EMAIL_USER) return false;
  const t = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await t.sendMail({
    from: `"Balancewise Technologies" <${process.env.EMAIL_USER}>`,
    to: 'info@balancewises.io',
    subject, html
  });
  return true;
}

// Contact API
app.post('/api/contact', async (req, res) => {
  const { name, email, company, service, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: 'Required fields missing.' });

  try {
    await sendMail(
      `New Enquiry from ${name} — Balancewise Technologies`,
      `<h2>New Enquiry</h2>
       <p><b>Name:</b> ${name}</p>
       <p><b>Email:</b> <a href="mailto:${email}">${email}</a></p>
       <p><b>Company:</b> ${company || 'N/A'}</p>
       <p><b>Service:</b> ${service || 'N/A'}</p>
       <p><b>Message:</b><br>${message}</p>`
    );
  } catch (e) { console.error('Mail error:', e.message); }

  res.json({ success: true });
});

// Apply API
app.post('/api/apply', async (req, res) => {
  const { fullname, email, role, github, linkedin, message } = req.body;
  if (!fullname || !email || !message)
    return res.status(400).json({ error: 'Required fields missing.' });

  try {
    await sendMail(
      `New Application: ${role} — ${fullname}`,
      `<h2>New Application</h2>
       <p><b>Name:</b> ${fullname}</p>
       <p><b>Email:</b> <a href="mailto:${email}">${email}</a></p>
       <p><b>Role:</b> ${role}</p>
       <p><b>GitHub:</b> ${github || 'N/A'}</p>
       <p><b>LinkedIn:</b> ${linkedin || 'N/A'}</p>
       <p><b>Message:</b><br>${message}</p>`
    );
  } catch (e) { console.error('Mail error:', e.message); }

  res.json({ success: true });
});

app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () =>
  console.log(`Balancewise Technologies running → http://localhost:${PORT}`)
);

module.exports = app;
