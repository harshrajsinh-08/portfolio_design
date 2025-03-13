const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
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
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('Blocked origin:', origin);
      return callback(null, false);
    }
    console.log('Allowed origin:', origin);
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: false
}));

app.use(express.json());

// Create OAuth2 client
const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

// Function to get new access token
async function getNewAccessToken() {
  try {
    const { token } = await oauth2Client.getAccessToken();
    return token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

// Create email transporter with OAuth2
const createTransporter = async () => {
  try {
    const accessToken = await getNewAccessToken();
    
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken
      }
    });
  } catch (error) {
    console.error('Error creating transporter:', error);
    throw error;
  }
};

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Verify email configuration on startup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    accessToken: process.env.GMAIL_ACCESS_TOKEN
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error details:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    console.log('Environment variables status:', {
      EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
      GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID ? 'Set' : 'Not set',
      GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET ? 'Set' : 'Not set',
      GMAIL_REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN ? 'Set' : 'Not set',
      GMAIL_ACCESS_TOKEN: process.env.GMAIL_ACCESS_TOKEN ? 'Set' : 'Not set'
    });
    console.log('Please check your Gmail OAuth2 credentials in .env file');
    console.log('Make sure you have:');
    console.log('1. Created a Google Cloud Project');
    console.log('2. Enabled Gmail API');
    console.log('3. Created OAuth2 credentials');
    console.log('4. Set up OAuth consent screen');
    console.log('5. Generated refresh token');
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

// Update the contact route with token refresh handling
app.post('/api/contact', validateContactForm, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    
    console.log('Creating email transporter...');
    const transporter = await createTransporter();
    
    console.log('Attempting to send email with details:', {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Contact Form Submission from ${firstName} ${lastName}`
    });
    
    // Create mail options with sanitized input
    const mailOptions = {
      from: {
        name: 'Portfolio Contact Form',
        address: process.env.EMAIL_USER
      },
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

    console.log('Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });
    
    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Detailed error sending email:', {
      error: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
      command: error.command,
      response: error.response
    });
    
    let errorMessage = 'Failed to send message. ';
    if (error.code === 'EAUTH') {
      errorMessage += 'Email authentication failed. Please check server configuration.';
    } else if (error.code === 'ESOCKET') {
      errorMessage += 'Network connection issue. Please try again.';
    } else {
      errorMessage += 'Please try again later.';
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? {
        code: error.code,
        message: error.message
      } : undefined
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