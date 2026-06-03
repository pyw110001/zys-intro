import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

// Parse .env.local manually to get GEMINI_API_KEY
let apiKey = process.env.GEMINI_API_KEY;
if (!apiKey && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    if (line.trim().startsWith('GEMINI_API_KEY=')) {
      apiKey = line.split('=')[1].trim();
      break;
    }
  }
}

if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
  console.error("Error: GEMINI_API_KEY is not set or is still the placeholder in .env.local.");
  console.error("Please add your actual Gemini API key to .env.local or set the GEMINI_API_KEY environment variable.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const srcDir = 'd:\\\\01_AIGC\\\\03_Antigravity\\\\BP\\\\PNG';
const outputFilePath = path.join(process.cwd(), 'slides_content.md');

// Resolve path properly on Windows
const normSrcDir = path.normalize(srcDir);

async function run() {
  try {
    const files = fs.readdirSync(normSrcDir)
      .filter(f => f.toLowerCase().endsWith('.png'))
      .sort((a, b) => {
        // Sort numerically based on the number at the end of the filename
        const aNum = parseInt(a.match(/_(\d+)\.png$/)?.[1] || '0', 10);
        const bNum = parseInt(b.match(/_(\d+)\.png$/)?.[1] || '0', 10);
        return aNum - bNum;
      });

    console.log(`Found ${files.length} images to analyze.`);
    
    // Clear or initialize the output file
    fs.writeFileSync(outputFilePath, '# Extracted Business Deck Content\n\n');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(normSrcDir, file);
      console.log(`Analyzing slide [${i + 1}/${files.length}]: ${file}...`);
      
      const fileBuffer = fs.readFileSync(filePath);
      const base64Image = fileBuffer.toString('base64');

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          'You are an expert OCR and business analyst. Please extract all the text from this slide image exactly. Output it as Markdown. Organize it with clear headings, bullet points, and structures. If there are tables or charts, represent their key data. Do not add conversational intro/outro text, just the slide content.',
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/png'
            }
          }
        ]
      });

      const text = response.text || 'No text extracted.';
      
      const slideSection = `\n## Slide ${file.match(/_(\d+)\.png$/)?.[1] || file} (${file})\n\n${text}\n\n---\n`;
      fs.appendFileSync(outputFilePath, slideSection);
      console.log(`Finished slide ${file}`);
    }

    console.log(`\nSuccess! All slides extracted and written to: ${outputFilePath}`);
  } catch (error) {
    console.error('Error during extraction:', error);
  }
}

run();
