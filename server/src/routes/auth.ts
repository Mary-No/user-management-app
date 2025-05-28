import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import dotenv from 'dotenv';
import {body, validationResult} from 'express-validator';

dotenv.config();
const router = Router();

router.post(
    '/register',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 }),
        body('name').optional().trim(),
    ],
    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = await prisma.user.create({
                data: {
                    email: req.body.email,
                    password: hashedPassword,
                    name: req.body.name,
                },
            });
            res.status(201).json({ user });
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                res.status(400).json({ error: 'Email already exists' });
                return;
            }
            res.status(500).json({ error: 'Registration failed' });
        }
    }
);

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (!user.status) {
            res.status(403).json({ error: 'User is blocked' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid password' });
            return;
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});




export default router;