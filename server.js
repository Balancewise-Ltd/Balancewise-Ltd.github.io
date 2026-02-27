/**
 * Balancewise Technologies — Express Server
 */
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

async function mail(subject, html) {
  if (!process.env.EMAIL_USER) return;
  const t = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
  await t.sendMail({ from: process.env.EMAIL_USER, to: 'info@balancewises.io', subject, html });
}

app.post('/api/contact', async (req, res) => {
  const { name, email, company, service, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Required fields missing.' });
  try { await mail(`Enquiry from ${name}`, `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Company:</b> ${company||'N/A'}</p><p><b>Service:</b> ${service||'N/A'}</p><p><b>Message:</b> ${message}</p>`); } catch(e) { console.error(e); }
  res.json({ success: true });
});

app.post('/api/apply', async (req, res) => {
  const { fullname, email, role, github, linkedin, message } = req.body;
  if (!fullname || !email || !message) return res.status(400).json({ error: 'Required fields missing.' });
  try { await mail(`Application: ${role} — ${fullname}`, `<p><b>Name:</b> ${fullname}</p><p><b>Email:</b> ${email}</p><p><b>Role:</b> ${role}</p><p><b>GitHub:</b> ${github||'N/A'}</p><p><b>LinkedIn:</b> ${linkedin||'N/A'}</p><p><b>Message:</b> ${message}</p>`); } catch(e) { console.error(e); }
  res.json({ success: true });
});

app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'index.html')));
app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
