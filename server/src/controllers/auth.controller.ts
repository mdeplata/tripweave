import User from '@models/User';
import { hashPassword, comparePassword, generateToken } from '@utils/auth';
import type { Request, Response } from 'express';

export const register = async (req: Request, res: Response): Promise<void> => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ error: 'Name, email, and password are required' });
            return;
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(400).json({ error: 'User with this email already exists' });
            return;
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = generateToken({ userId: newUser._id as string, email: newUser.email });

        res.status(201).json({ 
            message: 'User registered successfully', 
            token, 
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                avatar: newUser.avatar,
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }

        const token = generateToken({ userId: user._id as string, email: user.email });

        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMe = async ( req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?.userId).select('-password');

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};