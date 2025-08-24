# VWVenus WebApp - Vercel Deployment Guide

## 🚨 CRITICAL: Environment Variables Setup

**If you're experiencing 500 errors on API endpoints, this is likely due to missing environment variables in Vercel.**

### Required Environment Variables

You **MUST** set these environment variables in your Vercel dashboard:

1. **MONGODB_URI** - Your MongoDB connection string
2. **JWT_SECRET** - A secure secret key for JWT token signing
3. **NODE_ENV** - Set to `production`

### How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (`beta-vowveneus-v1`)
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

#### MONGODB_URI
```
Name: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
Environments: Production, Preview, Development
```

#### JWT_SECRET
```
Name: JWT_SECRET
Value: your-super-secret-jwt-key-here-make-it-long-and-random
Environments: Production, Preview, Development
```

#### NODE_ENV
```
Name: NODE_ENV
Value: production
Environments: Production, Preview
```

### 🔧 After Setting Environment Variables

1. **Redeploy your application** - Environment variables only take effect after redeployment
2. Go to **Deployments** tab in Vercel
3. Click **Redeploy** on the latest deployment
4. Wait for deployment to complete
5. Test your API endpoints

## Troubleshooting 500 Errors

### Check Vercel Function Logs

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Functions** tab
4. Click on any API function (e.g., `api/login.js`)
5. Check the **Invocations** and **Logs** for detailed error messages

### Common Issues and Solutions

#### 1. "MONGODB_URI environment variable is not defined"
- **Solution**: Set the `MONGODB_URI` environment variable in Vercel dashboard
- **Check**: Ensure the MongoDB connection string is correct and accessible

#### 2. "JWT_SECRET environment variable is not set"
- **Solution**: Set the `JWT_SECRET` environment variable in Vercel dashboard
- **Check**: Use a long, random string (at least 32 characters)

#### 3. "Database connection failed"
- **Solution**: Verify your MongoDB Atlas cluster is running and accessible
- **Check**: Ensure your MongoDB Atlas IP whitelist includes `0.0.0.0/0` for Vercel

#### 4. CORS Errors
- **Solution**: The API functions are now configured for your production domain
- **Check**: Ensure you're accessing the app via `https://beta-vowveneus-v1.vercel.app`

## Project Structure

This guide will help you deploy the VWVenus WebApp to Vercel with both frontend and backend functionality.

## Project Structure

The project has been configured for Vercel deployment with:
- **Frontend**: React + Vite application in `/client` folder
- **Backend**: Serverless API functions in `/api` folder
- **Database**: MongoDB Atlas connection
- **Authentication**: JWT-based authentication

## Prerequisites

1. **GitHub Account**: For code repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas**: Database cluster setup
4. **Node.js**: Version 18+ installed locally

## Environment Variables

Create these environment variables in your Vercel dashboard:

### Required Environment Variables

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vwvenus?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Environment
NODE_ENV=production
```

### How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable with the appropriate value
5. Make sure to set them for **Production**, **Preview**, and **Development** environments

## Deployment Steps

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - VWVenus WebApp ready for Vercel"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub and create a new repository
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/vwvenus-webapp.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: Leave as `./` (root)
   - **Build Command**: `npm run build` (already configured)
   - **Output Directory**: `dist` (already configured)
   - **Install Command**: `npm install`

3. **Set Environment Variables**:
   - Add all the environment variables listed above
   - Make sure `MONGODB_URI` points to your MongoDB Atlas cluster
   - Generate a strong `JWT_SECRET` (you can use: `openssl rand -base64 32`)

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

### Step 3: Verify Deployment

1. **Check Frontend**:
   - Visit your Vercel URL
   - Verify the homepage loads correctly
   - Check that venue listings appear

2. **Test API Endpoints**:
   - Test registration: `POST /api/register`
   - Test login: `POST /api/login`
   - Test venues: `GET /api/venues`
   - Test single venue: `GET /api/venues/:id`

3. **Test Authentication Flow**:
   - Register a new user
   - Login with credentials
   - Verify JWT token is stored and used
   - Test logout functionality

## API Endpoints

The following serverless functions are available:

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user info

### Venues
- `GET /api/venues` - Get all venues
- `GET /api/venues/:id` - Get specific venue

### Static Assets
- `/hall-pictures/*` - Hall images and assets

## Configuration Files

### vercel.json
Configures Vercel deployment settings:
- Serverless functions configuration
- Static file routing
- CORS headers
- Build settings

### package.json
Build scripts configured for Vercel:
- `npm run build` - Builds the client application
- `npm run copy-images` - Copies hall pictures to public directory
- `npm run vercel-build` - Vercel-specific build command

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas network access (allow all IPs: `0.0.0.0/0`)
   - Ensure database user has read/write permissions

2. **Authentication Issues**:
   - Verify `JWT_SECRET` is set
   - Check browser localStorage for `auth_token`
   - Ensure API endpoints return proper CORS headers

3. **Static Files Not Loading**:
   - Verify hall pictures are copied during build
   - Check `/hall-pictures/` routes in vercel.json
   - Ensure images exist in the repository

4. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in package.json
   - Ensure TypeScript compilation succeeds

### Debug Steps

1. **Check Vercel Function Logs**:
   - Go to Vercel dashboard → Functions tab
   - View logs for each API endpoint

2. **Test API Endpoints Directly**:
   ```bash
   # Test venues endpoint
   curl https://your-app.vercel.app/api/venues
   
   # Test specific venue
   curl https://your-app.vercel.app/api/venues/VENUE_ID
   ```

3. **Check Environment Variables**:
   - Verify all required env vars are set in Vercel
   - Ensure no typos in variable names

## Local Development

To run the project locally:

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your local MongoDB URI

# Start development server
npm run dev
```

## Production URLs

After deployment, your app will be available at:
- **Frontend**: `https://your-app-name.vercel.app`
- **API**: `https://your-app-name.vercel.app/api/*`

## Security Notes

1. **Environment Variables**: Never commit sensitive data to the repository
2. **JWT Secret**: Use a strong, randomly generated secret
3. **MongoDB**: Restrict network access when possible
4. **CORS**: Configure appropriate origins for production

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas connection
5. Review browser console for frontend errors

---

**Deployment Complete!** 🚀

Your VWVenus WebApp is now ready for production use on Vercel with full frontend and backend functionality.