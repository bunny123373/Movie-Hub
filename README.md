# MovieHub - Movie Download SaaS

A complete modern SaaS-style Movie Download Website built with React, Node.js, Express, and MongoDB.

## Features

### User Panel (Public)
- Browse trending, latest, and popular movies
- Category-based filtering (Telugu, Tamil, Hindi, English, Dubbed)
- Advanced filters (Genre, Year, Quality)
- Search with auto-suggestions
- Movie details page with download options
- Watchlist (localStorage based)
- Share buttons (Copy link / WhatsApp)
- Responsive design (Mobile + Desktop)
- Skeleton loaders and empty states

### Admin Dashboard
- Secure access with admin key
- Add/Edit/Delete movies
- Toggle movie visibility
- Mark movies as Trending/Featured
- Dashboard statistics
- Movie management table

## Tech Stack

### Frontend
- React (JavaScript)
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- CORS
- dotenv

## Project Structure

```
movie-download-saas/
├── backend/
│   ├── middleware/
│   │   └── adminAuth.js
│   ├── models/
│   │   └── Movie.js
│   ├── routes/
│   │   ├── movies.js
│   │   └── categories.js
│   ├── utils/
│   │   ├── googleDrive.js
│   │   └── seedData.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryBar.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── MovieSection.jsx
│   │   │   ├── MovieSkeleton.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ShareButtons.jsx
│   │   ├── contexts/
│   │   │   └── WatchlistContext.jsx
│   │   ├── hooks/
│   │   │   └── useMovies.js
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminMovieForm.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   └── Watchlist.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie-download-db?retryWrites=true&w=majority
ADMIN_KEY=your-secret-admin-key
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

5. Seed sample data (optional):
```bash
npm run seed
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## API Endpoints

### Movies
- `GET /api/movies` - Get all movies (with filters)
- `GET /api/movies/:id` - Get single movie
- `GET /api/movies/search-suggestions?q=query` - Search suggestions
- `GET /api/movies/related/:id` - Get related movies
- `POST /api/movies` - Create movie (Admin)
- `PUT /api/movies/:id` - Update movie (Admin)
- `DELETE /api/movies/:id` - Delete movie (Admin)
- `POST /api/movies/:id/download` - Increment download count
- `PATCH /api/movies/:id/toggle-active` - Toggle active status (Admin)
- `PATCH /api/movies/:id/toggle-trending` - Toggle trending status (Admin)
- `PATCH /api/movies/:id/toggle-featured` - Toggle featured status (Admin)

### Categories
- `GET /api/categories` - Get all categories/filters
- `GET /api/categories/stats` - Get dashboard stats

## Filter Parameters

- `language` - Telugu, Tamil, Hindi, English, Dubbed
- `category` - Movie, Web Series, Dubbed
- `genre` - Action, Comedy, Romance, Thriller, Horror, Drama, Sci-Fi, Adventure
- `year` - Release year
- `isTrending` - true/false
- `isFeatured` - true/false
- `search` - Search query

## Admin Access

1. Navigate to `/admin`
2. Enter your admin key (set in backend `.env`)
3. The key is stored in localStorage for the session

## Google Drive Integration

The system automatically converts Google Drive share links to direct download links:

- Input: `https://drive.google.com/file/d/FILE_ID/view`
- Output: `https://drive.google.com/uc?export=download&id=FILE_ID`

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `ADMIN_KEY` | Secret key for admin access |
| `NODE_ENV` | Environment (development/production) |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (default: http://localhost:5000/api) |

## License

MIT License
