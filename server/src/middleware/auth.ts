import { verifyToken } from '../utils/auth';
import type { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res
        .status(401)
        .json({ message: 'Authorization header missing or malformed' });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Token missing' });
      return;
    }

    const payload = verifyToken(token);

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token', error: error });
  }
};
