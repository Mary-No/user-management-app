import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

type JwtPayload = {
    id: number;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET!, async (err, decoded) => {
        if (err || !decoded) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        const { id } = decoded as JwtPayload;
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            return res.status(403).json({ error: 'User not found' });
        }

        if (!user.status) {
            return res.status(403).json({ error: 'User is blocked' });
        }

        await prisma.user.update({
            where: { id },
            data: { lastLogin: new Date() },
        });

        req.user = user;
        next();
    });
}