"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const documentSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    projectId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    summary: { type: String },
    createdAt: { type: Date, default: Date.now }
});
exports.Document = mongoose_1.default.model('Document', documentSchema);
