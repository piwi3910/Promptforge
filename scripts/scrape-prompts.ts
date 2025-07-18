import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://cursor.directory/';

interface ScrapedPrompt {
  title: string;
  author: string;
  tags: string[];
  description: string;
  prompt: string;
}

async function getPromptDetails(url: string): Promise<ScrapedPrompt | null> {
  try {
    console.log(`Scraping details from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.statusText}`);
      return null;
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('h1.text-lg.font-medium').first().text().trim();
    const author = $('h3.text-sm.font-medium').first().text().trim();
    const tags = $('div.pt-2.pb-4.border-b a').map((_, el: cheerio.Element) => $(el).text().trim()).get();
    const description = $('title').text().split(' by ')[0];
    const prompt = $('div.h-full.overflow-y-auto > code').first().text().trim();
    
    // Basic validation to ensure we have the core content
    if (!title || !prompt || !author) {
        console.warn(`Could not extract all details from ${url}, skipping.`);
        return null;
    }

    return { title, author, tags, description, prompt };
  } catch (error) {
    console.error(`Error scraping detail page ${url}:`, error);
    return null;
  }
}


async function scrapePrompts() {
  console.log('Starting prompt scraping from cursor.so/directory...');
  const allPrompts: ScrapedPrompt[] = [];

  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch main directory page: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    const promptLinks: string[] = [];
    $('div.bg-card > a').each((_, element: cheerio.Element) => {
        const href = $(element).attr('href');
        if (href) {
            const fullUrl = new URL(href, BASE_URL).toString();
            if (!promptLinks.includes(fullUrl)) {
                promptLinks.push(fullUrl);
            }
        }
    });

    console.log(`Found ${promptLinks.length} unique prompt links.`);

    for (const link of promptLinks) {
      const promptDetails = await getPromptDetails(link);
      if (promptDetails) {
        allPrompts.push(promptDetails);
      }
      // Add a small delay to avoid getting blocked
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const outputPath = path.join(process.cwd(), 'scraped-prompts.json');
    await fs.writeFile(outputPath, JSON.stringify(allPrompts, null, 2));

    console.log(`Successfully scraped ${allPrompts.length} prompts.`);
    console.log(`Output saved to: ${outputPath}`);

  } catch (error) {
    console.error('An error occurred during scraping:', error);
  }
}

scrapePrompts();
