# API Routes Documentation

## Base URL
`http://localhost:8000`

## Health & Status Endpoints

### GET /
Health check endpoint.

**Response:**
```json
{
  "status": "online",
  "service": "3Docs PDF Processing API",
  "version": "1.0.0"
}
```

### GET /health
Detailed health check with system information.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "volume_directory": "/path/to/volume",
  "volume_exists": true
}
```

---

## PDF Management Endpoints

### GET /pdfs
Get all PDFs currently in the database.

**Response:**
```json
{
  "success": true,
  "pdfs": [
    {
      "hash": "a1b2c3d4e5f6g7h8",
      "pdf_filename": "manual.pdf",
      "step_count": 5
    }
  ],
  "total_count": 1
}
```

### POST /upload-and-process
Upload a PDF file and process it immediately.

**Request:**
- Form data with file upload
- `file`: PDF file (required)
- `generate_tts`: boolean (default: true)
- `generate_3d`: boolean (default: true)

**Example cURL:**
```bash
curl -X POST http://localhost:8000/upload-and-process \
  -F "file=@trimmed.pdf" \
  -F "generate_tts=true" \
  -F "generate_3d=true"
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully uploaded and processed manual.pdf",
  "pdf_hash": "a1b2c3d4e5f6g7h8",
  "steps_processed": 5,
  "tts_files_generated": 5,
  "models_generated": 5
}
```

---

## File Retrieval Endpoints

All file retrieval endpoints use the PDF hash (first 16 characters) and optionally a step number.

### GET /pdf/{hash}
Get the original PDF file by hash.

**Parameters:**
- `hash`: First 16 characters of the PDF hash

**Example:**
```bash
curl http://localhost:8000/pdf/a1b2c3d4e5f6g7h8 -o manual.pdf
```

**Response:** PDF file (application/pdf)

---

### GET /image/{hash}/{step}
Get the image file for a specific step.

**Parameters:**
- `hash`: First 16 characters of the PDF hash
- `step`: Step number (0-indexed)

**Example:**
```bash
curl http://localhost:8000/image/a1b2c3d4e5f6g7h8/0 -o step-0.png
```

**Response:** Image file (image/png, image/jpeg, etc.)

**Supported formats:** PNG, JPG, JPEG, GIF, WEBP

---

### GET /glb/{hash}/{step}
Get the 3D model (GLB) file for a specific step.

**Parameters:**
- `hash`: First 16 characters of the PDF hash
- `step`: Step number (0-indexed)

**Example:**
```bash
curl http://localhost:8000/glb/a1b2c3d4e5f6g7h8/0 -o step-0.glb
```

**Response:** GLB file (model/gltf-binary)

---

### GET /mp3/{hash}/{step}
Get the audio (MP3) file for a specific step.

**Parameters:**
- `hash`: First 16 characters of the PDF hash
- `step`: Step number (0-indexed)

**Example:**
```bash
curl http://localhost:8000/mp3/a1b2c3d4e5f6g7h8/0 -o step-0.mp3
```

**Response:** MP3 file (audio/mpeg)

---

### GET /instruction/{hash}/{step}
Get the instruction text file for a specific step.

**Parameters:**
- `hash`: First 16 characters of the PDF hash
- `step`: Step number (0-indexed)

**Example:**
```bash
curl http://localhost:8000/instruction/a1b2c3d4e5f6g7h8/0
```

**Response:** Text file (text/plain)

**Format:**
```
Title of the instruction step

Detailed description of what to do in this step.
```

---

## Error Responses

All endpoints return consistent error responses:

### 404 Not Found
```json
{
  "detail": "PDF with hash {hash} not found"
}
```

### 400 Bad Request
```json
{
  "detail": "Only PDF files are supported"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Error message describing what went wrong"
}
```

---

## File Naming Convention

All generated files follow the pattern: `{hash}-{step}.{extension}`

- **Hash:** First 16 characters of the PDF's SHA-256 hash
- **Step:** Sequential step number starting from 0
- **Extensions:**
  - Images: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`
  - 3D Models: `.glb`
  - Audio: `.mp3`
  - Instructions: `.txt`

**Example filenames:**
- `a1b2c3d4e5f6g7h8-0.png`
- `a1b2c3d4e5f6g7h8-0.glb`
- `a1b2c3d4e5f6g7h8-0.mp3`
- `a1b2c3d4e5f6g7h8-0.txt`

---

## Processing Pipeline

When a PDF is uploaded via `/upload-and-process`:

1. **PDF Extraction** - Images and text are extracted from the PDF
2. **AI Analysis** - Gemini AI identifies instructional content
3. **Database Storage** - Results are stored with hash-based deduplication
4. **Asset Generation** (parallel):
   - **TTS Generation** - Text-to-speech audio files (if enabled)
   - **3D Model Generation** - 3D models from images (if enabled)

---

## CORS Configuration

The API has CORS enabled for all origins:
- `allow_origins: ["*"]`
- `allow_credentials: true`
- `allow_methods: ["*"]`
- `allow_headers: ["*"]`

For production, configure `allow_origins` to specific domains.
