# 🚀 Instagram Follower Checker - One Click Analysis

**The easiest way to find who's not following you back on Instagram!**

No copying, no manual input - just one button press and you get instant results. Works on desktop browsers with a simple Chrome extension.

## 🚀 Quick Start

### Option 1: Chrome Extension (Recommended - One Click!)
1. **Install the Chrome Extension**:
   - Download the extension files
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension folder

2. **Use the Extension**:
   - Go to Instagram.com and log in
   - Click the extension icon in your browser
   - Press "Extract Instagram Data"
   - Get instant results!

### Option 2: Web App (Manual Input)
1. **Open the web app** in any browser
2. **Follow the instructions** to manually input your data
3. **Get results** showing who's not following you back

### Option 3: Run Locally
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Open in browser**: `http://localhost:3000`

## 📋 How to Use

### Chrome Extension (One Click!)
1. **Install the extension** (see Quick Start above)
2. **Go to Instagram.com** and log in to your account
3. **Navigate to your profile page**
4. **Click the extension icon** in your browser toolbar
5. **Press "Extract Instagram Data"**
6. **Wait for extraction** (takes 1-3 minutes depending on follower count)
7. **View results** and download CSV if needed

### Web App (Manual Input)
1. **Open Instagram.com** in your browser
2. **Go to your profile page**
3. **Manually copy followers and following lists**
4. **Paste into the web app**
5. **Get instant analysis**

### What You Get
- **Total followers and following counts**
- **Who's not following you back**
- **Who you're not following back**
- **Mutual followers**
- **CSV export** with all data

## ✨ Features

- 🚀 **One Click Analysis**: Just press a button and get results
- 🔒 **Privacy First**: All processing happens on your device
- ⚡ **Automatic Extraction**: No manual copying required
- 📊 **Detailed Analysis**: 
  - Total followers/following counts
  - Who's not following you back
  - Who you're not following back
  - Mutual followers
- 📥 **Easy Export**: Download CSV with all data
- 🎨 **Beautiful UI**: Modern, intuitive design
- 🔧 **Multiple Options**: Chrome extension, web app, or local server

## 🔧 Technical Details

### How the Extension Works
1. **Content Script**: Runs on Instagram pages to extract data
2. **Automatic Scrolling**: Scrolls through all followers/following lists
3. **Data Extraction**: Captures usernames from the DOM
4. **Local Processing**: All analysis happens in your browser
5. **Secure**: Your data never leaves your device

### Browser Compatibility
- **Chrome/Edge**: Full support with extension
- **Firefox**: Extension support (requires adaptation)
- **Safari**: Limited extension support
- **Mobile**: Web app version available

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
├── manifest.json       # Chrome extension manifest
├── popup-simple.html   # Simple one-click popup interface
├── popup-simple.js     # Popup JavaScript logic
├── content.js          # Content script for Instagram data extraction
├── index.html          # Web app with manual input
├── mobile-app.html     # Full-featured mobile app
├── instagram-extractor.html # Auto mode web app
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
