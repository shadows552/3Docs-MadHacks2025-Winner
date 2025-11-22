# 3Docs - Interactive 3D Repair Guide

MadHacks 2025 Project

An interactive 3D repair guide that converts PDF manuals into immersive 3D experiences using AI-powered image-to-model conversion.

## Features

- 📄 PDF parsing and step extraction
- 🎨 Image-to-3D model conversion using Tripo3D
- 🗣️ Voice instruction support
- 💾 SQLite database for managing repair steps
- ⚛️ Modern Next.js frontend with React 19

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

### Backend
- Python 3
- SQLite
- Tripo3D API
- python-dotenv

## Setup Instructions

### Prerequisites
- Node.js 20+
- Python 3.8+
- Tripo3D API key (get from https://platform.tripo3d.ai/)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Add your Tripo3D API key to `.env`:
```
TRIPO_API_KEY=your_actual_api_key_here
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Dependencies are already installed! Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000

## Development

### Running the Backend
```bash
cd backend
python tripo.py  # For 3D model generation
python database.py  # For database operations
```

### Running the Frontend
```bash
cd frontend
npm run dev
```

## Project Structure

```
MadHacks2025/
├── backend/
│   ├── database.py          # SQLite database management
│   ├── tripo.py            # Tripo3D API integration
│   ├── requirements.txt    # Python dependencies
│   └── .env.example       # Environment variables template
└── frontend/
    ├── app/               # Next.js app directory
    ├── public/           # Static files
    └── package.json      # Node dependencies
```

## License

MIT
