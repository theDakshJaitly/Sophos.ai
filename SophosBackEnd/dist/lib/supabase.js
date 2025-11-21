"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasSupabaseConfig = exports.getSupabaseClients = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const getSupabaseClients = () => {
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url)
        return { anon: null, service: null };
    return {
        anon: anonKey ? (0, supabase_js_1.createClient)(url, anonKey) : null,
        service: serviceKey ? (0, supabase_js_1.createClient)(url, serviceKey) : null,
    };
};
exports.getSupabaseClients = getSupabaseClients;
const hasSupabaseConfig = () => {
    return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
};
exports.hasSupabaseConfig = hasSupabaseConfig;
