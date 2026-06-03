import fs from 'fs';
import path from 'path';

const contentPath = path.join(process.cwd(), 'slides_content.md');
const outputPath = path.join(process.cwd(), 'slidesData.ts');

function parseSlides() {
  if (!fs.existsSync(contentPath)) {
    console.error("Error: slides_content.md not found!");
    return;
  }

  const fileContent = fs.readFileSync(contentPath, 'utf8');
  
  // Split by slide markers
  const sections = fileContent.split(/## Slide\s+(\d+)\s+\((.*?)\)/i);
  
  const slides = [];
  
  // The split returns: [preamble, slideNum1, filename1, slideContent1, slideNum2, filename2, slideContent2, ...]
  for (let i = 1; i < sections.length; i += 3) {
    const num = sections[i].trim();
    const filename = sections[i + 1].trim();
    let body = sections[i + 2] || '';
    
    // Clean up trailing dashes from slide separation
    body = body.replace(/---$/, '').trim();
    
    // Extract first heading as title
    let title = `Slide ${num}`;
    const headingMatch = body.match(/^(?:#|##|###)\s*(.*)$/m);
    if (headingMatch && headingMatch[1]) {
      title = headingMatch[1].trim().replace(/\(.*?\)/g, '').trim(); // Remove English translation in parens for title if present, or keep clean
    }
    
    // If title is just "Slide Content" or "Technology", try to find a better one
    if (title.toLowerCase() === 'slide content' || title.toLowerCase() === 'technology') {
      const betterMatch = body.match(/^(?:\*|###?)\s*\*\*([^*]+)\*\*/m) || body.match(/^(?:\*|###?)\s*([^:\n*]+)/m);
      if (betterMatch && betterMatch[1]) {
        title = betterMatch[1].trim();
      }
    }
    
    // Image name corresponding to compressed WebP
    const webpName = filename.replace(/\.png$/i, '.webp');
    const imagePath = `/slides/${webpName}`;
    
    slides.push({
      num,
      image: imagePath,
      title,
      content: body
    });
  }
  
  // Generate TS content
  const tsContent = `/**
 * Generated slides data for ZYS Digital Studio
 */

export interface Slide {
  num: string;
  image: string;
  title: string;
  content: string;
}

export const SLIDES: Slide[] = ${JSON.stringify(slides, null, 2)};
`;

  fs.writeFileSync(outputPath, tsContent, 'utf8');
  console.log(`Successfully generated slidesData.ts with ${slides.length} slides.`);
}

parseSlides();
