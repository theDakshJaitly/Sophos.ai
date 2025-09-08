import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserJwtPayload } from '../types/jwt';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (typeof decoded === 'string' || !('id' in decoded)) {
      res.status(401).json({ error: 'Invalid token format' });
      return;
    }
    
    req.user = decoded as UserJwtPayload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};