"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    projectId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Project' },
    messages: [{
            sender: { type: String, enum: ['user', 'ai'], required: true },
            message: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }]
});
exports.Chat = mongoose_1.default.model('Chat', chatSchema);
