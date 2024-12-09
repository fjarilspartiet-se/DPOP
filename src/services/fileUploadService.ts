// src/services/fileUploadService.ts

interface UploadProgress {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

type ProgressCallback = (progress: number) => void;

// Add this check for browser environment
const isBrowser = typeof window !== 'undefined';

export const fileUploadService = {
  // Maximum file size in bytes (10MB)
  MAX_FILE_SIZE: 10 * 1024 * 1024,

  // Allowed MIME types
  ALLOWED_TYPES: {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    media: ['video/mp4', 'audio/mpeg', 'audio/wav']
  },

  async uploadFile(
    file: File, 
    resourceType: string, 
    onProgress?: ProgressCallback
  ): Promise<{ url: string; metadata: Record<string, any> }> {
    // Ensure we're in the browser
    if (!isBrowser) {
      throw new Error('File upload can only be performed in the browser');
    }

    // Rest of the code remains the same
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error('File size exceeds maximum limit of 10MB');
    }

    const allowedTypes = Object.values(this.ALLOWED_TYPES).flat();
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('resourceType', resourceType);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return {
        url: data.url,
        metadata: {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadDate: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  },

  async uploadMultipleFiles(
    files: File[],
    resourceType: string,
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<Array<{ url: string; metadata: Record<string, any> }>> {
    // Ensure we're in the browser
    if (!isBrowser) {
      throw new Error('File upload can only be performed in the browser');
    }

    return await Promise.all(
      files.map((file, index) => 
        this.uploadFile(
          file,
          resourceType,
          progress => onProgress?.(index, progress)
        )
      )
    );
  }
};
