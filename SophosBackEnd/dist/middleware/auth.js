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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const supabase_admin_1 = require("../lib/supabase-admin");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header is missing or malformed.' });
    }
    const token = authHeader.split(' ')[1];
    console.log(`\n[AUTH MIDDLEWARE] Route: ${req.method} ${req.originalUrl}`);
    console.log(`[AUTH MIDDLEWARE] Received token (first 20 chars): ${token.substring(0, 20)}...`);
    try {
        // We ask Supabase to validate the token and give us the user
        const { data: { user }, error } = yield supabase_admin_1.supabaseAdmin.auth.getUser(token);
        console.log(`[AUTH MIDDLEWARE] Supabase getUser result:`, { user, error });
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
        res.locals.user = user;
        next();
    }
    catch (error) {
        console.error("A critical error occurred in the auth middleware:", error);
        res.status(500).json({ message: 'Internal server error during authentication' });
    }
});
exports.authMiddleware = authMiddleware;
