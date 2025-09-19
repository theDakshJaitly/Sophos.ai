// In SophosBackEnd/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase-admin';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header is missing or malformed.' });
  }

  const token = authHeader.split(' ')[1];
  console.log(`Middleware received token starting with: ${token.substring(0, 10)}...`);

  try {
    // We ask Supabase to validate the token and give us the user
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    // If Supabase returns an error, we log it and reject the request
    if (error) {
      console.error('--- SUPABASE AUTH VALIDATION ERROR ---');
      console.error('Status:', error.status);
      console.error('Message:', error.message);
      console.error('------------------------------------');
      return res.status(401).json({ message: `Authentication Failed: ${error.message}` });
    }

    // If there's no error but the user is null, it's also a failure
    if (!user) {
      console.error('--- SUPABASE AUTH VALIDATION ERROR ---');
      console.error('Token was considered valid, but no user was returned.');
      console.error('------------------------------------');
      return res.status(401).json({ message: 'User not found for the provided token.' });
    }
    
    console.log("Token successfully validated for user:", user.id);
    req.user = user;
    next();

  } catch (error) {
    console.error("A critical error occurred in the auth middleware:", error);
    res.status(500).json({ message: 'Internal server error during authentication' });
  }
};