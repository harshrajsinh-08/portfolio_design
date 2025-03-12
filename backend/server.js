const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://harshrajsinh.vercel.app',
  'https://portfolio-design-harshraj.vercel.app',
  'https://portfolio-design-git-main-harshrajs-projects.vercel.app',
  'https://portfolio-design.vercel.app'
];

// CORS middleware with detailed error handling
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('Request with no origin');
      return callback(null, true);
    }

    console.log('Request from origin:', origin);

    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('Origin not allowed:', origin);
      return callback(new Error('CORS not allowed'));
    }

    console.log('Origin allowed:', origin);
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Verify email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
    console.log('Please check your Gmail credentials in .env file');
    console.log('Make sure you have:');
    console.log('1. Enabled 2-Step Verification in your Google Account');
    console.log('2. Generated an App Password for this application');
    console.log('3. Used your Gmail address and App Password in .env file');
  } else {
    console.log('Server is ready to send emails');
  }
});

// Validation middleware
const validateContactForm = (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;
  const errors = {};

  // First Name validation
  if (!firstName || firstName.length < 2 || !/^[A-Za-z\s]+$/.test(firstName)) {
    errors.firstName = 'First name must be at least 2 characters long and contain only letters';
  }

  // Last Name validation
  if (!lastName || lastName.length < 2 || !/^[A-Za-z\s]+$/.test(lastName)) {
    errors.lastName = 'Last name must be at least 2 characters long and contain only letters';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  if (!phone || phone.replace(/[\s\-\(\)\+]/g, '').length < 10 || !phoneRegex.test(phone)) {
    errors.phone = 'Please enter a valid phone number (minimum 10 digits)';
  }

  // Message validation
  if (!message || message.length < 10 || message.length > 1000) {
    errors.message = 'Message must be between 10 and 1000 characters';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

// Update the contact route to use validation middleware
app.post('/api/contact', validateContactForm, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    
    // Create mail options with sanitized input
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Contact Form Submission from ${firstName} ${lastName}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5001;

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
}); 