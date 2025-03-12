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

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;
  
  // Input validation
  if (!firstName || !lastName || !email || !phone || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  try {
    // Email content
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: white; padding: 15px; border-radius: 5px;">${message}</p>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      message: 'Error sending message. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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