let analysisData = null;

async function extractData() {
    const extractBtn = document.getElementById('extractBtn');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const status = document.getElementById('status');

    // Check if we're on Instagram
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url || !tab.url.includes('instagram.com')) {
        status.textContent = 'Please open Instagram first';
        return;
    }

    // Show loading state
    extractBtn.disabled = true;
    loading.style.display = 'block';
    results.style.display = 'none';
    status.textContent = 'Extracting data...';

    try {
        // Extract followers first
        status.textContent = 'Extracting followers...';
        const followersResult = await chrome.tabs.sendMessage(tab.id, { 
            kind: 'INSTA_SCRAPE', 
            which: 'followers' 
        });

        if (!followersResult || !followersResult.ok) {
            throw new Error(followersResult?.error || 'Failed to extract followers');
        }

        // Extract following
        status.textContent = 'Extracting following...';
        const followingResult = await chrome.tabs.sendMessage(tab.id, { 
            kind: 'INSTA_SCRAPE', 
            which: 'following' 
        });

        if (!followingResult || !followingResult.ok) {
            throw new Error(followingResult?.error || 'Failed to extract following');
        }

        // Process the data
        const followers = followersResult.usernames || [];
        const following = followingResult.usernames || [];

        // Find who's not following back
        const followersSet = new Set(followers.map(f => f.toLowerCase()));
        const notFollowingBack = following.filter(user => 
            !followersSet.has(user.toLowerCase())
        );

        // Find who you're not following back
        const followingSet = new Set(following.map(f => f.toLowerCase()));
        const notFollowingThem = followers.filter(user => 
            !followingSet.has(user.toLowerCase())
        );

        // Find mutual followers
        const mutual = followers.filter(user => 
            followingSet.has(user.toLowerCase())
        );

        analysisData = {
            followers: followers,
            following: following,
            notFollowingBack: notFollowingBack,
            notFollowingBackCount: notFollowingBack.length,
            notFollowingThem: notFollowingThem,
            notFollowingThemCount: notFollowingThem.length,
            mutual: mutual,
            mutualCount: mutual.length
        };

        // Show results
        document.getElementById('followersCount').textContent = followers.length;
        document.getElementById('followingCount').textContent = following.length;
        document.getElementById('notFollowingCount').textContent = notFollowingBack.length;

        loading.style.display = 'none';
        results.style.display = 'block';
        status.textContent = `Found ${notFollowingBack.length} not following back`;

    } catch (error) {
        console.error('Extraction error:', error);
        loading.style.display = 'none';
        extractBtn.disabled = false;
        status.textContent = `Error: ${error.message}`;
    }
}

function downloadResults() {
    if (!analysisData) return;

    const csvContent = [
        'username,type',
        ...analysisData.notFollowingBack.map(username => `${username},not_following_back`),
        ...analysisData.notFollowingThem.map(username => `${username},you_not_following`),
        ...analysisData.mutual.map(username => `${username},mutual`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    chrome.downloads.download({
        url: url,
        filename: 'instagram_analysis.csv',
        saveAs: true
    });
}

// Check if we're on Instagram when popup opens
document.addEventListener('DOMContentLoaded', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const status = document.getElementById('status');
    
    if (tab && tab.url && tab.url.includes('instagram.com')) {
        status.textContent = 'Ready to extract data';
    } else {
        status.textContent = 'Please open Instagram first';
        document.getElementById('extractBtn').disabled = true;
    }
});
