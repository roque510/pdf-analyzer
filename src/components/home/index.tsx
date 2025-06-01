import { Button, Container, Field, Input, Stack, Text, Box } from '@chakra-ui/react'
import { PageHeader } from './page-header'
import { useState } from 'react'
import { Toaster, toaster } from "@/components/ui/toaster"
import Footer from '@/components/footer'
import { PDFUpload } from '@/components/pdf-upload'

interface MockResponse {
  answer: string
  confidence: number
  source: string
}

export const Home = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<MockResponse | null>(null)

  const handlePdfUpload = (file: File) => {
    setPdfFile(file)
    setResponse(null)
  }

  const handleQuestionSubmit = async () => {
    if (!question.trim()) return
    
    setIsLoading(true)
    setResponse(null)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock response
      const mockResponses: MockResponse[] = [
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
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
      setResponse(randomResponse)
      
      toaster.create({
        title: "Success",
        description: "Answer generated successfully",
        type: "success"
      })
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "Failed to process question. Please try again",
        type: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setPdfFile(null)
    setQuestion('')
    setResponse(null)
    toaster.create({
      title: "Reset",
      description: "Ready to upload a new PDF",
      type: "success"
    })
  }

  return (
    <Container 
      maxW="container.xl" 
      py={{ base: '16', md: '24' }} 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      minH="100vh"
      px={{ base: '4', md: '6' }}
    >
      <Toaster />
      <PageHeader
        tagline="Understand Your Documents"
        headline="Ask Your Documents Anything"
        description="Turn dense documents into quick answers with AI-powered search and summarization."
        align="center"
        textAlign="center"
      >
        <Stack gap="2" alignItems="center" w="full">
          {!pdfFile ? (
            <PDFUpload onFileSelect={handlePdfUpload} />
          ) : (
            <Stack direction={{ base: 'column', sm: 'row' }} gap="3" w="full" maxW="container.md">
              <Field.Root>
                <Input
                  placeholder="Ask a question about your PDF"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  size={{ base: 'lg', md: 'xl' }}
                  disabled={isLoading}
                />
              </Field.Root>
              <Button 
                size={{ base: 'lg', md: 'xl' }}
                onClick={handleQuestionSubmit}
                loading={isLoading}
              >
                Ask
              </Button>
              <Button
                size={{ base: 'lg', md: 'xl' }}
                onClick={handleReset}
                variant="outline"
              >
                Upload New PDF
              </Button>
            </Stack>
          )}
          {response && (
            <Box 
              mt="6" 
              p="6" 
              bg="gray.50" 
              borderRadius="lg" 
              w="full"
              maxW="container.md"
              border="1px solid"
              borderColor="gray.200"
            >
              <Stack gap="4">
                <Text fontSize="lg" fontWeight="medium">
                  {response.answer}
                </Text>
                <Stack direction="row" gap="4" fontSize="sm" color="gray.600" flexWrap="wrap">
                  <Text>Confidence: {(response.confidence * 100).toFixed(1)}%</Text>
                  <Text>Source: {response.source}</Text>
                </Stack>
              </Stack>
            </Box>
          )}
          <Text textStyle="xs" color="fg.muted" textAlign="center">
            {pdfFile ? 'Ask any question about your uploaded PDF' : 'Upload a PDF to get started up to 10MB'}
          </Text>
        </Stack>
      </PageHeader>
      <Footer />
    </Container>
  )
}
