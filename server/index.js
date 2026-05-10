const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const port = 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/ping', (req, res) => res.json({ message: 'pong' }));

// Trips
app.get('/api/trips', async (req, res) => {
  const trips = await prisma.trip.findMany({
    include: { stops: true, packingList: true, notes: true }
  });
  res.json(trips);
});

app.post('/api/trips', async (req, res) => {
  const trip = await prisma.trip.create({
    data: req.body
  });
  res.json(trip);
});

// Cities
app.get('/api/cities', async (req, res) => {
  const cities = await prisma.city.findMany();
  res.json(cities);
});

// Activities
app.get('/api/activities', async (req, res) => {
  const activities = await prisma.activity.findMany();
  res.json(activities);
});

app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
  console.log(`Connected to SQLite Database: ${process.env.DATABASE_URL}`);
});
