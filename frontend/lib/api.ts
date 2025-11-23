// API client for 3Docs backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface PDFInfo {
  hash: string;
  pdf_filename: string;
  step_count: number;
}

export interface PDFListResponse {
  success: boolean;
  pdfs: PDFInfo[];
  total_count: number;
}

export interface ProcessResponse {
  success: boolean;
  message: string;
  pdf_hash: string;
  steps_processed: number;
  tts_files_generated: number | null;
  models_generated: number | null;
}

/**
 * Fetch all PDFs from the database
 */
export async function fetchPDFs(): Promise<PDFListResponse> {
  const response = await fetch(`${API_BASE_URL}/pdfs`);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDFs: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Upload and process a PDF file
 */
export async function uploadAndProcessPDF(
  file: File,
  generateTTS: boolean = true,
  generate3D: boolean = true
): Promise<ProcessResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('generate_tts', generateTTS.toString());
  formData.append('generate_3d', generate3D.toString());

  const response = await fetch(`${API_BASE_URL}/upload-and-process`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || 'Failed to upload and process PDF');
  }

  return response.json();
}

/**
 * Get URL for PDF file
 */
export function getPDFUrl(hash: string): string {
  return `${API_BASE_URL}/pdf/${hash}`;
}

/**
 * Get URL for image file
 */
export function getImageUrl(hash: string, step: number): string {
  return `${API_BASE_URL}/image/${hash}/${step}`;
}

/**
 * Get URL for GLB model file
 */
export function getGLBUrl(hash: string, step: number): string {
  return `${API_BASE_URL}/glb/${hash}/${step}`;
}

/**
 * Get URL for MP3 audio file
 */
export function getMP3Url(hash: string, step: number): string {
  return `${API_BASE_URL}/mp3/${hash}/${step}`;
}

/**
 * Get URL for instruction text file
 */
export function getInstructionUrl(hash: string, step: number): string {
  return `${API_BASE_URL}/instruction/${hash}/${step}`;
}

/**
 * Fetch instruction text content
 */
export async function fetchInstruction(hash: string, step: number): Promise<string> {
  const response = await fetch(getInstructionUrl(hash, step));
  if (!response.ok) {
    throw new Error(`Failed to fetch instruction: ${response.statusText}`);
  }
  return response.text();
}

/**
 * Get PDF info by hash
 */
export async function fetchPDFInfo(hash: string): Promise<PDFInfo | null> {
  const response = await fetchPDFs();
  return response.pdfs.find(pdf => pdf.hash === hash) || null;
}

/**
 * Fetch all steps for a PDF
 * Returns an array of step numbers (0-indexed)
 */
export async function fetchPDFSteps(hash: string): Promise<number[]> {
  const pdfInfo = await fetchPDFInfo(hash);
  if (!pdfInfo) {
    throw new Error(`PDF with hash ${hash} not found`);
  }

  // Generate array of step numbers [0, 1, 2, ..., step_count - 1]
  return Array.from({ length: pdfInfo.step_count }, (_, i) => i);
}

/**
 * Fetch instruction data with title and description parsed
 */
export async function fetchInstructionData(hash: string, step: number): Promise<{ title: string; description: string }> {
  const text = await fetchInstruction(hash, step);

  // Instructions are stored as: title\n\ndescription
  const parts = text.split('\n\n', 2);
  if (parts.length === 2) {
    return {
      title: parts[0].trim(),
      description: parts[1].trim()
    };
  }

  // Fallback if format is different
  return {
    title: `Step ${step + 1}`,
    description: text.trim()
  };
}

/**
 * Position data for a step
 */
export interface StepPosition {
  page_number: number;
  y_coordinate: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    width: number;
    height: number;
  };
}

/**
 * Fetch step position data (page number and Y-coordinate)
 */
export async function fetchStepPosition(hash: string, step: number): Promise<StepPosition | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/step-position/${hash}/${step}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return {
      page_number: data.page_number,
      y_coordinate: data.y_coordinate,
      bbox: data.bbox
    };
  } catch (error) {
    console.error(`Failed to fetch position for step ${step}:`, error);
    return null;
  }
}
