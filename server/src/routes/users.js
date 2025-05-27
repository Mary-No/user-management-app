"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express"); //
const prisma_1 = __importDefault(require("../prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.default.user.findMany({
            orderBy: { lastLogin: 'desc' },
            select: { id: true, email: true, name: true, status: true, lastLogin: true },
        });
        res.json(users);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/block', auth_1.authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userIds, status } = req.body;
        if (!Array.isArray(userIds) || typeof status !== 'boolean') {
            res.status(400).json({ error: 'Invalid input: provide userIds (array) and status (boolean)' });
            return;
        }
        yield prisma_1.default.user.updateMany({
            where: { id: { in: userIds } },
            data: { status },
        });
        res.json({ message: status ? 'Users unblocked' : 'Users blocked' });
    }
    catch (error) {
        next(error);
    }
}));
router.post('/delete', auth_1.authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userIds } = req.body;
        yield prisma_1.default.user.deleteMany({
            where: { id: { in: userIds } },
        });
        res.json({ message: 'Users deleted' });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
