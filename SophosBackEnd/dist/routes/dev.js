"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devRoutes = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
// Simple dev login to mint a JWT for a dummy user
router.get('/login', (req, res) => {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const dummyUserId = process.env.DEV_USER_ID || '000000000000000000000001';
    const token = jsonwebtoken_1.default.sign({ id: dummyUserId }, secret, { expiresIn: '7d' });
    res.json({ token });
});
exports.devRoutes = router;
