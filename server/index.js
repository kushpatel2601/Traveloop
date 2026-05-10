const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const app = express();
const port = 3001;

// Standard Prisma Client (v7 works with DATABASE_URL in schema)
const prisma = new PrismaClient();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API Routes
app.get('/api/ping', (req, res) => res.json({ message: 'pong' }));

// Google Auth Route
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();

    let user;
    try {
      user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.user.create({
          data: { name, email },
        });
      }
    } catch (dbError) {
      console.error('Database Error:', dbError);
      return res.status(500).json({ message: 'Database connection failed.' });
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ user, accessToken });
  } catch (authError) {
    console.error('Google Auth Error:', authError);
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

// Trips (Protected)
app.get('/api/trips', authenticateToken, async (req, res) => {
  const trips = await prisma.trip.findMany({
    where: { userId: req.user.id },
    include: { stops: true, packingList: true, notes: true }
  });
  res.json(trips);
});

app.post('/api/trips', authenticateToken, async (req, res) => {
  const trip = await prisma.trip.create({
    data: {
      ...req.body,
      userId: req.user.id
    }
  });
  res.json(trip);
});

// Cities (Public)
app.get('/api/cities', async (req, res) => {
  const cities = await prisma.city.findMany();
  res.json(cities);
});

// Activities (Public)
app.get('/api/activities', async (req, res) => {
  const activities = await prisma.activity.findMany();
  res.json(activities);
});

app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});
