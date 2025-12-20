# Sistema de Encuesta Electoral UNCP

## Overview
A voting/survey system for UNCP (Universidad Nacional del Centro del Peru). Users can vote as either "Docente" (Teacher) or "Estudiante" (Student), and administrators can view and export results.

## Project Architecture
- **Backend**: Node.js with Express.js
- **Database**: SQLite (file-based at `./votos.db`)
- **Frontend**: Static HTML/CSS served from `public/` directory

## Structure
```
├── server.js           # Express server with API endpoints
├── public/
│   ├── index.html      # Main landing page
│   ├── votacion.html   # Voting interface
│   ├── admin.html      # Admin panel
│   ├── login.html      # Admin login
│   └── styles.css      # Shared styles
└── votos.db            # SQLite database (auto-created)
```

## API Endpoints
- `POST /api/votar` - Submit a vote
- `GET /api/resultados` - Get voting results
- `GET /api/descargar-excel` - Download results as Excel
- `POST /api/login` - Admin authentication
- `POST /api/admin/cambiar-password` - Change admin password

## Default Admin Credentials
- Username: `admin`
- Password: `123456`

## Running the Project
The server runs on port 5000 and serves both the static frontend and the API.
