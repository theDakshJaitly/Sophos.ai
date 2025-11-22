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
exports.projectRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Project_1 = require("../models/Project");
const supabase_1 = require("../lib/supabase");
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if ((0, supabase_1.hasSupabaseConfig)()) {
            const { service } = (0, supabase_1.getSupabaseClients)();
            const { data, error } = yield service
                .from('projects')
                .select('id, name, "group"')
                .eq('user_id', req.user.id);
            if (error) {
                res.status(500).json({ error: 'Failed to fetch projects' });
                return;
            }
            res.json(data);
            return;
        }
        const projects = yield Project_1.Project.find({ userId: req.user.id });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if ((0, supabase_1.hasSupabaseConfig)()) {
            const { service } = (0, supabase_1.getSupabaseClients)();
            const payload = {
                name: req.body.name,
                group: req.body.group,
                user_id: req.user.id,
            };
            const { data, error } = yield service
                .from('projects')
                .insert(payload)
                .select('id, name, "group"')
                .single();
            if (error) {
                res.status(500).json({ error: 'Failed to create project' });
                return;
            }
            res.status(201).json(data);
            return;
        }
        const project = new Project_1.Project(Object.assign(Object.assign({}, req.body), { userId: req.user.id }));
        yield project.save();
        res.status(201).json(project);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
}));
exports.projectRoutes = router;
