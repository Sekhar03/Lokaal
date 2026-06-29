import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0-lokaal' });
});

const authMiddleware = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    const user = await prisma.user.findUnique({ where: { id: token } });
    if (user) {
      req.user = user;
      return next();
    }
  }

  // Fallback for development if no valid token
  req.user = {
    id: 'mock-user-123',
    phone: '+919876543210',
    role: 'RESIDENT',
    pinCode: '462001'
  };
  next();
};

// --- API Routes (Stubs for all modules) ---

// 0. Auth
app.post('/api/auth/send-otp', async (req, res) => {
  const { phone } = req.body;
  console.log(`[MOCK OTP] Sent 123456 to ${phone}`);
  res.json({ success: true });
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  if (otp !== '123456') {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        phone,
        name: 'New User',
        pinCode: '',
      }
    });
  }

  res.json({ token: user.id, user });
});

app.put('/api/auth/profile', authMiddleware, async (req: any, res) => {
  const { name, role, flatNumber, verificationDoc } = req.body;
  if (!name || !role) return res.status(400).json({ error: 'Name and role required' });
  
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, role, flatNumber, verificationDoc }
  });
  res.json({ success: true, user });
});

app.post('/api/auth/location', authMiddleware, async (req: any, res) => {
  const { pinCode } = req.body;
  if (!pinCode) return res.status(400).json({ error: 'pinCode required' });
  
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { pinCode }
  });
  res.json({ success: true, user });
});

// 1. Feed
app.get('/api/feed', authMiddleware, async (req: any, res) => {
  const posts = await prisma.post.findMany({
    where: { locality: req.user.pinCode },
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  });
  res.json(posts);
});

// 2. Events
app.get('/api/events', authMiddleware, async (req: any, res) => {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' }
  });
  res.json(events);
});

// 3. Groups (Directory)
app.get('/api/groups', authMiddleware, async (req: any, res) => {
  res.json([]);
});

// Directory - Users and Societies by Pincode
app.get('/api/directory/users', authMiddleware, async (req: any, res) => {
  const users = await prisma.user.findMany({
    where: { pinCode: req.user.pinCode }
  });
  res.json(users);
});

app.get('/api/directory/societies', authMiddleware, async (req: any, res) => {
  const societies = await prisma.society.findMany({
    where: { pinCode: req.user.pinCode }
  });
  res.json(societies);
});

// 4. Society Management
app.get('/api/society/:id/dues', authMiddleware, async (req: any, res) => {
  res.json([]);
});

// 5. Market / Classifieds
app.get('/api/market/listings', authMiddleware, async (req: any, res) => {
  const listings = await prisma.listing.findMany({
    where: { locality: req.user.pinCode, status: 'ACTIVE' }
  });
  res.json(listings);
});

// 6. Business Directory
app.get('/api/business', authMiddleware, async (req: any, res) => {
  const businesses = await prisma.business.findMany({
    where: { locality: req.user.pinCode, isActive: true }
  });
  res.json(businesses);
});

// --- MOCK ADAPTERS ---

// Mock Razorpay Order Generation
app.post('/api/razorpay/order', authMiddleware, (req, res) => {
  const { amount, receipt } = req.body;
  // Return a mock Razorpay Order object
  res.json({
    id: `order_mock_${Date.now()}`,
    amount,
    currency: 'INR',
    receipt,
    status: 'created'
  });
});

// Mock Razorpay Webhook (Simulate Payment Capture)
app.post('/api/razorpay/webhook', (req, res) => {
  const { event, payload } = req.body;
  if (event === 'payment.captured') {
    console.log('[MOCK RAZORPAY] Payment Captured for Order:', payload.payment.entity.order_id);
    // In a real app, update DB Dues/Tickets to PAID status here
  }
  res.status(200).json({ status: 'ok' });
});

// Mock Cloudinary Upload
app.post('/api/upload/cloudinary', authMiddleware, (req, res) => {
  // Simulate image upload by returning a random Pravatar URL
  const randomId = Math.floor(Math.random() * 70);
  res.json({
    url: `https://i.pravatar.cc/300?img=${randomId}`,
    public_id: `mock_upload_${Date.now()}`,
    format: 'jpg'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Lokaal API running on http://localhost:${PORT}`);
});

export default app;
