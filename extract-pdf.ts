import { NextApiRequest, NextApiResponse } from 'next';
import pdfParse from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the file from the request
    const chunks: any[] = [];
    
    await new Promise((resolve, reject) => {
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', resolve);
      req.on('error', reject);
    });

    const buffer = Buffer.concat(chunks);
    
    // Parse the PDF
    const data = await pdfParse(buffer);
    
    if (!data.text || data.text.trim().length === 0) {
      return res.status(400).json({ error: 'No text could be extracted from the PDF' });
    }
    
    res.status(200).json({ 
      text: data.text,
      pages: data.numpages,
      info: data.info
    });
  } catch (err) {
    console.error('PDF extraction error:', err);
    res.status(500).json({ 
      error: 'Failed to extract PDF text.',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}
