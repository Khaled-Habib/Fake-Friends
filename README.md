# 📱 Instagram Follower Checker for Safari

**The easiest way to find who's not following you back on Instagram!**

Simple, clean web app that works perfectly on Safari for iPhone. No extensions needed - just enter your numbers and get instant results.

## 🚀 Quick Start

### Option 1: Use the Web App (Recommended)
1. **Open Safari on your iPhone**
2. **Go to the web app URL** (once deployed)
3. **Follow the simple instructions**
4. **Get instant results!**

### Option 2: Run Locally
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Open in Safari**: `http://localhost:3000/safari-app.html`

## 📋 How to Use

### Safari Web App (Simple & Easy!)
1. **Open Safari on your iPhone**
2. **Go to Instagram.com** and log in to your account
3. **Navigate to your profile page**
4. **Check your follower count** (tap "followers")
5. **Check your following count** (tap "following")
6. **Enter both numbers** in the web app
7. **Get instant analysis** and results

### What You Get
- **Total followers and following counts**
- **Who's not following you back** (estimate)
- **Who you're not following back** (estimate)
- **Mutual followers** (estimate)
- **CSV export** with all data

## ✨ Features

- 📱 **Safari Optimized**: Designed specifically for iPhone Safari
- 🔒 **Privacy First**: All processing happens on your device
- ⚡ **Simple Input**: Just enter your follower/following numbers
- 📊 **Quick Analysis**: 
  - Total followers/following counts
  - Who's not following you back (estimate)
  - Who you're not following back (estimate)
  - Mutual followers (estimate)
- 📥 **Easy Export**: Download CSV with all data
- 🎨 **Beautiful UI**: Modern, intuitive design
- 🌐 **No Extensions**: Works directly in Safari

## 🔧 Technical Details

### How the Web App Works
1. **Simple Input**: Enter your follower/following counts
2. **Quick Calculation**: Estimates based on the numbers you provide
3. **Local Processing**: All analysis happens in your browser
4. **Secure**: Your data never leaves your device
5. **No Extensions**: Works directly in Safari

### Browser Compatibility
- **Safari on iPhone**: Full support (optimized)
- **Safari on Mac**: Full support
- **Chrome/Edge**: Works but not optimized
- **Mobile browsers**: Responsive design

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
├── safari-app.html     # Safari-optimized app for iPhone (main)
├── index.html          # Basic web app version
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
