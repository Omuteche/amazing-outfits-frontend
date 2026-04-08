# AmazingOutfits Frontend

Self-hostable React frontend for the AmazingOutfits e-commerce store.

## Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and set VITE_API_URL to your backend URL
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Deployment

The `dist/` folder can be deployed to any static hosting:
- Vercel, Netlify, Nginx, Apache, AWS S3 + CloudFront

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (e.g., `http://localhost:5000/api`) |
| `VITE_PAYSTACK_PUBLIC_KEY` | Paystack public key for payments |

## Project Structure

```
frontend/
├── src/
│   ├── components/     # UI components
│   ├── contexts/       # Auth & Cart contexts
│   ├── lib/            # API client & utilities
│   ├── pages/          # Page components
│   └── hooks/          # Custom hooks
├── package.json
└── vite.config.ts
```
