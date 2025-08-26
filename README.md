# 📱 Instagram Follower Checker for iPhone

A mobile-friendly web app that helps you identify Instagram accounts you follow who don't follow you back. Works perfectly on iPhone Safari!

## 🚀 Quick Start

### Option 1: Use the Web App (Easiest)
1. **Open Safari on your iPhone**
2. **Go to**: [Your deployed URL here]
3. **Follow the instructions** to paste your Instagram data
4. **Get instant results** showing who's not following you back

### Option 2: Run Locally
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Open on iPhone**:
   - Make sure your iPhone and computer are on the same WiFi network
   - Find your computer's IP address (e.g., `192.168.1.100`)
   - Open Safari on iPhone and go to: `http://192.168.1.100:3000`

## 📋 How to Use

### Step 1: Get Your Instagram Data
1. **Open Instagram.com** in Safari on your iPhone
2. **Go to your profile page** (tap your profile picture)
3. **Tap "followers"** to see your followers list
4. **Copy all usernames** (you can select all and copy)
5. **Tap "following"** to see who you follow
6. **Copy all usernames** from that list too

### Step 2: Analyze Your Data
1. **Paste your followers** into the first text box
2. **Paste your following** into the second text box
3. **Tap "Analyze Data"**
4. **View your results** instantly!

### Step 3: Export Results
- **Download CSV**: Get a file with all the data
- **Copy to clipboard**: Quick summary for sharing

## ✨ Features

- 📱 **iPhone Optimized**: Designed specifically for mobile Safari
- 🔒 **Privacy First**: All processing happens on your device
- ⚡ **Instant Results**: No waiting, no server delays
- 📊 **Detailed Analysis**: 
  - Total followers/following counts
  - Who's not following you back
  - Who you're not following back
  - Mutual followers
- 📥 **Easy Export**: Download CSV or copy to clipboard
- 🎨 **Beautiful UI**: Modern, intuitive design

## 🔧 Technical Details

### Why Not Automatic?
Instagram's security policies prevent automatic data extraction without:
- Instagram Business/Creator account
- Facebook Developer account
- Instagram Graph API access
- Meta app review approval

### How It Works
1. **Manual Input**: You paste your follower/following lists
2. **Local Processing**: All analysis happens in your browser
3. **Instant Results**: No server calls, no data storage
4. **Secure**: Your data never leaves your device

## 🛠️ Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [your-repo-url]
cd instagram-follower-checker

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### Project Structure
```
├── index.html          # Simple demo version
├── mobile-app.html     # Full-featured mobile app
├── server.js           # Express server for enhanced features
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## 🌐 Deployment

### Option 1: Static Hosting (Recommended)
Deploy the HTML files to any static hosting service:
- **Netlify**: Drag and drop the HTML files
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Push to a GitHub repository
- **Firebase Hosting**: Use Firebase CLI

### Option 2: Full Stack
Deploy with the Node.js server for enhanced features:
- **Heroku**: Connect your GitHub repository
- **Vercel**: Supports Node.js functions
- **Railway**: Easy Node.js deployment
- **DigitalOcean**: App Platform

## 📱 iPhone Optimization

The app includes several iPhone-specific optimizations:
- **Touch-friendly buttons**: Large, easy-to-tap elements
- **Safari compatibility**: Tested specifically for iOS Safari
- **Responsive design**: Works on all iPhone screen sizes
- **iOS gestures**: Supports pinch-to-zoom and swipe gestures
- **Keyboard optimization**: Better input experience

## 🔒 Privacy & Security

- **No data storage**: Your Instagram data is never saved
- **Local processing**: All analysis happens in your browser
- **No tracking**: No analytics, no cookies, no tracking
- **Open source**: Transparent code you can review

## 🐛 Troubleshooting

### Common Issues

**"Can't copy usernames from Instagram"**
- Try selecting text manually instead of "Select All"
- Some Instagram elements may be protected from copying

**"Results seem wrong"**
- Make sure you copied complete lists
- Check that usernames are one per line
- Remove any extra text or formatting

**"App doesn't work on iPhone"**
- Make sure you're using Safari (not Chrome or other browsers)
- Check that JavaScript is enabled
- Try refreshing the page

### Getting Help
If you encounter issues:
1. Check the browser console for errors
2. Try refreshing the page
3. Make sure you're using the latest version of Safari
4. Contact support with specific error messages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Instagram for the platform
- Apple for Safari's excellent web standards support
- The open source community for inspiration and tools

---

**Made with ❤️ for iPhone users who want to understand their Instagram network better!**
