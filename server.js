const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Store temporary data (in production, use a database)
const userData = new Map();

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to process Instagram data
app.post('/api/analyze', async (req, res) => {
    try {
        const { followers, following } = req.body;
        
        if (!followers || !following) {
            return res.status(400).json({ error: 'Missing followers or following data' });
        }

        // Convert to sets for efficient comparison
        const followersSet = new Set(followers.map(f => f.toLowerCase()));
        const followingSet = new Set(following.map(f => f.toLowerCase()));
        
        // Find who's not following back
        const notFollowingBack = following.filter(user => 
            !followersSet.has(user.toLowerCase())
        );

        // Find who you're not following back
        const notFollowingThem = followers.filter(user => 
            !followingSet.has(user.toLowerCase())
        );

        const results = {
            followers: followers.length,
            following: following.length,
            notFollowingBack: notFollowingBack,
            notFollowingBackCount: notFollowingBack.length,
            notFollowingThem: notFollowingThem,
            notFollowingThemCount: notFollowingThem.length,
            mutual: followers.filter(user => followingSet.has(user.toLowerCase())),
            mutualCount: followers.filter(user => followingSet.has(user.toLowerCase())).length
        };

        // Store results with a unique ID
        const sessionId = Date.now().toString();
        userData.set(sessionId, results);

        res.json({ 
            success: true, 
            sessionId,
            results 
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

// Get results by session ID
app.get('/api/results/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const results = userData.get(sessionId);
    
    if (!results) {
        return res.status(404).json({ error: 'Results not found' });
    }
    
    res.json({ success: true, results });
});

// Download results as CSV
app.get('/api/download/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const results = userData.get(sessionId);
    
    if (!results) {
        return res.status(404).json({ error: 'Results not found' });
    }

    const csvContent = [
        'username,type',
        ...results.notFollowingBack.map(username => `${username},not_following_back`),
        ...results.notFollowingThem.map(username => `${username},you_not_following`),
        ...results.mutual.map(username => `${username},mutual`)
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="instagram_analysis.csv"');
    res.send(csvContent);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 Instagram Follower Checker running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} in your iPhone browser`);
});
