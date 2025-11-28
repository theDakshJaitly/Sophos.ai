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
exports.githubRoutes = void 0;
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const supabase_admin_1 = require("../lib/supabase-admin");
const router = (0, express_1.Router)();
exports.githubRoutes = router;
const groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
// Extract owner and repo from GitHub URL
function parseGithubUrl(url) {
    try {
        const patterns = [
            /github\.com\/([^\/]+)\/([^\/]+)/,
            /^([^\/]+)\/([^\/]+)$/
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
            }
        }
        return null;
    }
    catch (_a) {
        return null;
    }
}
// Fetch repository file tree
function fetchFileTree(owner, repo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Sophos-AI'
                }
            });
            `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'Sophos-AI'
                    }
                };
            ;
            if (response.data.content) {
                return Buffer.from(response.data.content, 'base64').toString('utf-8');
            }
            return '';
        }
        catch (error) {
            console.error(`Error fetching file ${path}:`, error.message);
            return '';
        }
    });
}
// Helper to get file type description
function getFileTypeDescription(fileName) {
    var _a;
    const ext = (_a = fileName.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    const typeMap = {
        'ts': 'TypeScript source file',
        'tsx': 'TypeScript React component',
        'js': 'JavaScript source file',
        'jsx': 'JavaScript React component',
        'py': 'Python script',
        'json': 'JSON configuration file',
        'md': 'Markdown documentation',
        'yml': 'YAML configuration',
        'yaml': 'YAML configuration',
        'txt': 'Text file',
        'css': 'Stylesheet',
        'html': 'HTML template',
        'env': 'Environment variables',
        'gitignore': 'Git ignore rules',
        'lock': 'Dependency lock file'
    };
    return typeMap[ext || ''] || 'File';
}
// Transform file tree to graph nodes and edges
function buildGraph(tree) {
    const nodes = [];
    const edges = [];
    const pathMap = new Map();
    // Count children for each folder
    const folderCounts = new Map();
    tree.forEach(item => {
        const pathParts = item.path.split('/');
        if (pathParts.length > 1) {
            const parentPath = pathParts.slice(0, -1).join('/');
            if (!folderCounts.has(parentPath)) {
                folderCounts.set(parentPath, { files: 0, folders: 0 });
            }
            const counts = folderCounts.get(parentPath);
            if (item.type === 'blob') {
                counts.files++;
            }
            else {
                counts.folders++;
            }
        }
    });
    // Create root node
    const rootCounts = folderCounts.get('') || { files: 0, folders: 0 };
    nodes.push({
        id: 'root',
        label: '📁 Repository',
        type: 'folder',
        position: { x: 0, y: 0 },
        description: `Root directory with ${rootCounts.files} files and ${rootCounts.folders} folders`,
        source: 'Main repository structure'
    });
    let yOffset = 100;
    tree.forEach((item, index) => {
        if (item.type === 'tree' || item.type === 'blob') {
            const pathParts = item.path.split('/');
            const fileName = pathParts[pathParts.length - 1];
            const parentPath = pathParts.slice(0, -1).join('/');
            const nodeId = `node-${item.sha || index}`;
            pathMap.set(item.path, nodeId);
            let description;
            let source;
            if (item.type === 'tree') {
                // Folder node
                const counts = folderCounts.get(item.path) || { files: 0, folders: 0 };
                description = `Directory containing ${counts.files} files and ${counts.folders} subdirectories`;
                source = `Located at: ${item.path}`;
            }
            else {
                // File node
                const fileType = getFileTypeDescription(fileName);
                description = `${fileType} in the repository`;
                source = `Path: ${item.path}`;
                // Add special descriptions for common files
                if (fileName === 'package.json') {
                    description = 'Node.js package configuration with dependencies and scripts';
                }
                else if (fileName === 'README.md') {
                    description = 'Project documentation and overview';
                }
                else if (fileName === 'tsconfig.json') {
                    description = 'TypeScript compiler configuration';
                }
                else if (fileName === '.gitignore') {
                    description = 'Files and directories to ignore in version control';
                }
                else if (fileName.includes('test') || fileName.includes('spec')) {
                    description = `Test file for ${fileType}`;
                }
            }
            // Create node
            nodes.push({
                id: nodeId,
                label: item.type === 'tree' ? `📁 ${fileName}` : `📄 ${fileName}`,
                type: item.type === 'tree' ? 'folder' : 'file',
                position: {
                    x: (index % 5) * 150,
                    y: yOffset + Math.floor(index / 5) * 80
                },
                description,
                source
            });
            // Create edge to parent
            const parentId = parentPath ? pathMap.get(parentPath) : 'root';
            if (parentId) {
                edges.push({
                    id: `edge-${nodeId}`,
                    source: parentId,
                    target: nodeId
                });
            }
        }
    });
    return { nodes: nodes.slice(0, 50), edges: edges.slice(0, 50) }; // Limit for visualization
}
// Transform commits to timeline
function buildTimeline(commits) {
    return commits.map((commit, index) => ({
        id: `commit-${commit.sha.substring(0, 7)}`,
        date: commit.commit.author.date.split('T')[0],
        title: commit.commit.message.split('\n')[0],
        description: `Author: ${commit.commit.author.name}`,
        category: 'commit'
    }));
}
// Generate action plan using AI
function generateActionPlan(repoContext) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const prompt = `Based on this GitHub repository, create a detailed development action plan.
Repository Context:
${repoContext}
Create 3 phases with DETAILED sub-tasks. Each task MUST have:
- id (e.g., "task-1-1")
- text (clear action description)
- estimated_effort (e.g., "15 minutes", "1 hour")
- priority ("high", "medium", or "low")
Return ONLY valid JSON in this EXACT format:
{
  "phases": [
    {
      "id": "phase-1",
      "name": "Setup & Configuration",
      "description": "Initialize project environment",
      "steps": [
        {
          "id": "task-1-1",
          "text": "Install dependencies and setup development environment",
          "estimated_effort": "15 minutes",
          "priority": "high"
        },
        {
          "id": "task-1-2",
          "text": "Configure environment variables and API keys",
          "estimated_effort": "10 minutes",
          "priority": "high"
        }
      ]
    }
  ]
}`;
            const completion = yield groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.3,
                max_tokens: 2000,
            });
            const content = ((_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || '{"phases":[]}';
            const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            return JSON.parse(cleaned);
        }
        catch (error) {
            console.error('Error generating action plan:', error);
            return {
                phases: [
                    {
                        id: 'phase-1',
                        name: 'Codebase Analysis',
                        description: 'Review repository structure and dependencies',
                        steps: [
                            {
                                id: 'task-1-1',
                                text: 'Read README and documentation',
                                estimated_effort: '30 minutes',
                                priority: 'high'
                            },
                            {
                                id: 'task-1-2',
                                text: 'Review package.json and dependencies',
                                estimated_effort: '20 minutes',
                                priority: 'high'
                            },
                            {
                                id: 'task-1-3',
                                text: 'Explore main directory structure',
                                estimated_effort: '15 minutes',
                                priority: 'medium'
                            }
                        ]
                    },
                    {
                        id: 'phase-2',
                        name: 'Development Setup',
                        description: 'Setup local development environment',
                        steps: [
                            {
                                id: 'task-2-1',
                                text: 'Clone repository and install dependencies',
                                estimated_effort: '10 minutes',
                                priority: 'high'
                            },
                            {
                                id: 'task-2-2',
                                text: 'Configure environment variables',
                                estimated_effort: '15 minutes',
                                priority: 'high'
                            },
                            {
                                id: 'task-2-3',
                                text: 'Run development server and verify setup',
                                estimated_effort: '10 minutes',
                                priority: 'medium'
                            }
                        ]
                    },
                    {
                        id: 'phase-3',
                        name: 'Code Contribution',
                        description: 'Make improvements or fix issues',
                        steps: [
                            {
                                id: 'task-3-1',
                                text: 'Identify areas for improvement or bugs to fix',
                                estimated_effort: '1 hour',
                                priority: 'medium'
                            },
                            {
                                id: 'task-3-2',
                                text: 'Implement changes with proper testing',
                                estimated_effort: '2 hours',
                                priority: 'medium'
                            },
                            {
                                id: 'task-3-3',
                                text: 'Submit pull request with documentation',
                                estimated_effort: '30 minutes',
                                priority: 'low'
                            }
                        ]
                    }
                ]
            };
        }
    });
}
// Main processing endpoint
router.post('/process', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { url } = req.body;
        const userId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated.' });
        }
        if (!url) {
            return res.status(400).json({ error: 'GitHub URL is required.' });
        }
        console.log(`Processing GitHub repository: ${url}`);
        // Parse URL
        const parsed = parseGithubUrl(url);
        if (!parsed) {
            return res.status(400).json({ error: 'Invalid GitHub URL format.' });
        }
        const { owner, repo } = parsed;
        console.log(`Owner: ${owner}, Repo: ${repo}`);
        // Fetch data from GitHub
        const [tree, commits] = yield Promise.all([
            fetchFileTree(owner, repo),
            fetchCommits(owner, repo)
        ]);
        console.log(`Fetched ${tree.length} files and ${commits.length} commits`);
        // Fetch README for context
        let readmeContent = '';
        try {
            readmeContent = yield fetchFileContent(owner, repo, 'README.md');
        }
        catch (_b) {
            console.log('No README.md found');
        }
        // Build graph and timeline
        const { nodes, edges } = buildGraph(tree);
        const timeline = buildTimeline(commits);
        // Generate action plan
        const repoContext = `Repository: ${owner}/${repo}\n${readmeContent.substring(0, 1000)}`;
        const actionPlan = yield generateActionPlan(repoContext);
        // Save to database (with timestamp to allow reprocessing)
        // NOTE: Chat won't work without content_text column - add it to enable chat
        const timestamp = Date.now();
        const { data: document, error: docError } = yield supabase_admin_1.supabaseAdmin
            .from('documents')
            .insert({
            user_id: userId,
            file_name: `GitHub: ${owner}/${repo}`,
            file_hash: `github-${owner}-${repo}-${timestamp}`,
            concepts: { nodes, edges },
            timeline: { events: timeline },
            action_plan: actionPlan
        })
            .select('id')
            .single();
        if (docError) {
            console.error('Database error:', docError);
            throw docError;
        }
        console.log('GitHub repository processed successfully');
        // Return response
        res.status(200).json({
            nodes,
            edges,
            timeline,
            actionPlan,
            documentId: document.id,
            repoName: `${owner}/${repo}`
        });
    }
    catch (error) {
        console.error('Error processing GitHub repository:', error);
        res.status(500).json({
            error: error.message || 'Failed to process GitHub repository'
        });
    }
}));
