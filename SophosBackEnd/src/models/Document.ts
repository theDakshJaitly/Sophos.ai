import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    summary: { type: String },
    createdAt: { type: Date, default: Date.now }
});
  
export const Document = mongoose.model('Document', documentSchema);