'use client'

import { Button, FileUpload, Stack, Text, useEnvironmentContext } from '@chakra-ui/react'
import { useState } from 'react'
import { toaster } from '@/components/ui/toaster'

interface PDFUploadProps extends FileUpload.RootProps {
  onFileSelect?: (file: File) => void
}

export const PDFUpload = (props: PDFUploadProps) => {
  const { onFileSelect, ...rest } = props
  const [fileName, setFileName] = useState<string>()
  const env = useEnvironmentContext()

  return (
    <FileUpload.Root
      accept=".pdf"
      maxFileSize={10485760} // 10MB
      flexDirection="column"
      alignItems="center"
      onFileChange={(e) => {
        const file = e.acceptedFiles[0]
        if (file) {
          // Ensure we're passing a proper File object
          const pdfFile = new File([file], file.name, { type: 'application/pdf' })
          setFileName(file.name)
          onFileSelect?.(pdfFile)
          toaster.create({
            title: "Success",
            description: "PDF uploaded successfully",
            type: "success"
          })
        }
      }}
      {...rest}
    >
      <FileUpload.HiddenInput />
      <Stack gap="4" align="center">
        <FileUpload.Trigger asChild>
          <Button size="lg" variant="outline" colorPalette="teal">
            {fileName ? 'Change PDF' : 'Upload PDF'}
          </Button>
        </FileUpload.Trigger>
        {fileName && (
          <Text color="fg.muted" textStyle="sm">
            Selected: {fileName}
          </Text>
        )}        
      </Stack>
    </FileUpload.Root>
  )
} 