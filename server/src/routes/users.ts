import { Router, Request, Response, NextFunction } from 'express'; //
import prisma from '../prisma';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { lastLogin: 'desc' },
            select: { id: true, email: true, name: true, status: true, lastLogin: true },
        });
        res.json(users);
    } catch (error) {
        next(error);
    }
});


router.post('/block', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userIds, status } = req.body;
        if (!Array.isArray(userIds) || typeof status !== 'boolean') {
            res.status(400).json({ error: 'Invalid input: provide userIds (array) and status (boolean)' });
            return;
        }
        await prisma.user.updateMany({
            where: { id: { in: userIds } },
            data: { status },
        });
        res.json({ message: status ? 'Users unblocked' : 'Users blocked' });
    } catch (error) {
        next(error);
    }
});

router.post('/delete', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userIds } = req.body;
        await prisma.user.deleteMany({
            where: {id: {in: userIds}},
        });
        res.json({ message: 'Users deleted' });
    } catch (error) {
        next(error);
    }
});


export default router;