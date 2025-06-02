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

export class PDFAnalyzerAPI {
  private static instance: PDFAnalyzerAPI
  private baseUrl: string

  private constructor() {
       this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api'
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