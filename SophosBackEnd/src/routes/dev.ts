import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Simple dev login to mint a JWT for a dummy user
router.get('/login', (req, res): void => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const dummyUserId = process.env.DEV_USER_ID || '000000000000000000000001';

  const token = jwt.sign(
    { id: dummyUserId },
    secret,
    { expiresIn: '7d' }
  );

  res.json({ token });
});

export const devRoutes = router;


