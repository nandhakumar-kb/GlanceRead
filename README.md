# GlanceRead

A modern digital library application for reading books and viewing infographics.

## Features

- User authentication and authorization
- Book library with search functionality
- Infographic viewer with zoom controls
- Admin dashboard for managing books and users
- Responsive design with dark/light theme support

## Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router
- Axios
- Framer Motion

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- ImageKit for media storage

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- ImageKit account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd GlanceRead
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:

**Server (.env):**
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
PORT=5000
```

**Client (.env):**
```env
VITE_API_URL=http://localhost:5000
```

4. Run the application:

```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm run dev
```

## Deployment

### Backend (Render)
1. Push code to GitHub
2. Connect your GitHub repository to Render
3. Create a new Web Service
4. Set environment variables in Render dashboard
5. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `client`
4. Set environment variable `VITE_API_URL` to your backend URL
5. Deploy

## License

MIT
