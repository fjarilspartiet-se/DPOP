// src/pages/api/upload.ts

import getConfig from 'next/config';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { withErrorHandler } from '@/middleware/error';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Disable the default body parser to handle files
export const config = {
  api: {
    bodyParser: false,
  },
};

const { serverRuntimeConfig } = getConfig();
const uploadDir = path.join(process.cwd(), serverRuntimeConfig.uploadDir);

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFiles: 5,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filename: (name, ext, part) => {
        const uniqueId = uuidv4();
        return `${uniqueId}${ext}`;
      },
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Handle files
    const fileResponses = await Promise.all(
      Object.values(files).map(async (file: formidable.File) => {
        // Generate public URL
        const publicPath = `/uploads/${path.basename(file.filepath)}`;
        
        return {
          url: publicPath,
          name: file.originalFilename,
          type: file.mimetype,
          size: file.size
        };
      })
    );

    res.status(200).json(fileResponses);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}

export default withErrorHandler(handler);
