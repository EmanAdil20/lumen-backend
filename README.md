# Lumen AI Backend

This is the small backend that lets the AI Coach and AI Reviews in your Lumen
app call Google's Gemini API safely — your API key lives here on the server,
never in your website's code where anyone could copy it.

## What it does

Your Netlify frontend sends a message to this backend.
This backend adds your secret API key and forwards the request to Gemini.
Gemini responds, this backend strips out any sensitive info, and returns
just the text reply to your app.

## Setup — takes about 10 minutes

### Step 1 — Create a free Vercel account

Go to https://vercel.com/signup and sign up (GitHub login recommended).

### Step 2 — Push this folder to GitHub

Create a new repository on GitHub (https://github.com/new).
Call it something like `lumen-backend`. Make it private if you prefer.

Then in this folder run:
```
git init
git add .
git commit -m "Initial backend"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/lumen-backend.git
git push -u origin main
```

### Step 3 — Connect to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your `lumen-backend` repository from GitHub
4. Leave all build settings as-is (Vercel auto-detects serverless functions)
5. Click Deploy

After a minute, Vercel gives you a URL like:
`https://lumen-backend-abc123.vercel.app`

Your AI endpoint will be at:
`https://lumen-backend-abc123.vercel.app/api/ai`

### Step 4 — Add your secret environment variables

In the Vercel dashboard, go to your project → Settings → Environment Variables.

Add two variables:

| Name | Value |
|---|---|
| `GEMINI_API_KEY` | Your API key from Google AI Studio (starts with AIza...) |
| `ALLOWED_ORIGIN` | Your Netlify site URL, e.g. `https://your-app.netlify.app` |

Click Save after adding each one.
Then go to Deployments → click the three dots on your latest deploy → Redeploy
(so the environment variables take effect).

### Step 5 — Update your Lumen app

In your `lumen-project/src/App.jsx`, find this line near the top:

```js
const AI_BACKEND_URL = null;
```

Replace it with your actual backend URL:

```js
const AI_BACKEND_URL = "https://lumen-backend-abc123.vercel.app/api/ai";
```

Then push your updated frontend to GitHub as usual:
```
git add .
git commit -m "Connect AI backend"
git push
```

Netlify will redeploy automatically.

## That's it

The AI Coach and AI Reviews tabs will now work on your live site.
Each message costs roughly $0.000001 — essentially free at personal usage levels.
Google's free tier gives you 1,500 requests per day before any charges apply,
which is far more than any personal habit tracker would use.
"# lumen-backend" 
