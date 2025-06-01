export interface PDFResponse {
  answer: string
  confidence: number
  source: string
}

export interface APIErrorResponse {
  code: string
  message: string
  details?: string
}

export class APIError extends Error {
  constructor(public code: string, message: string, public details?: string) {
    super(message)
    this.name = 'APIError'
  }
}

const MOCK_DELAY = 1500 // 1.5 seconds

const mockResponses: PDFResponse[] = [
  {
    answer: "Based on the document, the main points discussed are the implementation of AI-driven analysis and the importance of data security in modern systems.",
    confidence: 0.92,
    source: "Page 3, Section 2.1"
  },
  {
    answer: "The document outlines three key methodologies: machine learning algorithms, natural language processing, and statistical analysis.",
    confidence: 0.88,
    source: "Page 5, Section 3.2"
  },
  {
    answer: "According to the research findings, the system achieved a 95% accuracy rate in document classification tasks.",
    confidence: 0.95,
    source: "Page 8, Section 4.3"
  }
]

export class PDFAnalyzerAPI {
  private static instance: PDFAnalyzerAPI
  private baseUrl: string

  private constructor() {
    this.baseUrl = 'http://127.0.0.1:8000/api'
  }

  public static getInstance(): PDFAnalyzerAPI {
    if (!PDFAnalyzerAPI.instance) {
      PDFAnalyzerAPI.instance = new PDFAnalyzerAPI()
    }
    return PDFAnalyzerAPI.instance
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };

    // Only set Content-Type if body is not FormData
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new APIError(
          error.code || 'UNKNOWN_ERROR',
          error.message || 'An unknown error occurred',
          error.details
        )
      }

      return response.json()
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }
      throw new APIError(
        'NETWORK_ERROR',
        'Failed to connect to the server',
        error instanceof Error ? error.message : undefined
      )
    }
  }

  public async uploadPDF(file: File): Promise<{ id: string }> {
    const formData = new FormData()
    formData.append('file', file, file.name)

    return this.request<{ id: string }>('/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary
      },
    })
  }

  public async askQuestion(pdfId: string, question: string): Promise<PDFResponse> {
    return this.request<PDFResponse>('/ask', {
      method: 'POST',
      body: JSON.stringify({ pdfId, question }),
    })
  }
}

// Export a singleton instance
export const pdfAnalyzerAPI = PDFAnalyzerAPI.getInstance() 