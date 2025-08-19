# WJLM Official Website

The official website for Banele WJLM - Content Creator & Influencer.

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**: 
   - Create a GitHub repository
   - Push your code to GitHub

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a static site
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? `Y`
   - Which scope? `Select your account`
   - Link to existing project? `N`
   - Project name? `wjlm-website` (or your preferred name)
   - Directory? `./` (current directory)

## 📁 Project Structure

```
├── public/                 # Main website files
│   ├── index.html         # Homepage
│   ├── merchandise.html   # Merchandise page
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   └── pics/             # Images
├── vercel.json           # Vercel configuration
└── package.json          # Project dependencies
```

## 🌐 Custom Domain (Optional)

After deployment, you can add a custom domain:

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Domains"
4. Add your custom domain (e.g., `wjlm.com`)

## 🔧 Environment Variables

If you need to add environment variables (like API keys), add them in:
- Vercel Dashboard → Project Settings → Environment Variables

## 📱 Features

- ✨ Modern responsive design
- 🎨 Beautiful animations and effects
- 🛍️ Merchandise store
- 📺 Video integration
- 🎙️ Podcast section
- 📅 Events calendar
- 💬 Contact forms

## 🚀 Live Demo

Your site will be available at: `https://your-project-name.vercel.app`

---

**Made with ❤️ for WJLM**
