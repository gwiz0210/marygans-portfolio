import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const inputFile = path.join(rootDir, 'mary-portfolio-case-studies.csv');
const outputDir = path.join(rootDir, 'src/content/case-studies');

function parseCsv(text) {
  const rows = [];
  let current = '';
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(current);
      current = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1;
      }
      row.push(current);
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      current = '';
      continue;
    }

    current += char;
  }

  if (current || row.length) {
    row.push(current);
    if (row.some((value) => value !== '')) rows.push(row);
  }

  const [header, ...dataRows] = rows;
  return dataRows.map((values) => Object.fromEntries(header.map((key, index) => [key, values[index] ?? ''])));
}

function sanitizeHtmlForMdx(html) {
  return html
    .replace(/<!--.*?-->/gs, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<div\b[^>]*>/gi, '')
    .replace(/<\/div>/gi, '')
    .replace(/<figure\b[^>]*>/gi, '')
    .replace(/<\/figure>/gi, '')
    .replace(/<img\b([^>]*)>/g, '<img$1 />')
    .replace(/<br>/gi, '<br />')
    .replace(/<hr>/gi, '<hr />')
    .replace(/<p\s+id=""\s*>/gi, '<p>')
    .replace(/<p\s+id="[^"]*">/gi, '<p>')
    .replace(/<h([1-6])\s+id=""\s*>/gi, '<h$1>')
    .replace(/<h([1-6])\s+id="[^"]*">/gi, '<h$1>')
    .replace(/<ul\s+id=""\s*>/gi, '<ul>')
    .replace(/<ul\s+id="[^"]*">/gi, '<ul>')
    .replace(/<ol\s+id=""\s*>/gi, '<ol>')
    .replace(/<ol\s+id="[^"]*">/gi, '<ol>')
    .replace(/<li\s+id=""\s*>/gi, '<li>')
    .replace(/<li\s+id="[^"]*">/gi, '<li>')
    .replace(/<strong\s+id=""\s*>/gi, '<strong>')
    .replace(/<strong\s+id="[^"]*">/gi, '<strong>')
    .replace(/<a\s+id=""\s+href="([^"]*)">/gi, '<a href="$1">')
    .replace(/<a\s+id="[^"]*"\s+href="([^"]*)">/gi, '<a href="$1">')
    .replace(/\s+/g, ' ')
    .trim();
}

function toFrontmatter(row) {
  const safeSlug = (row.Slug || row.title || '').toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const title = (row.title || safeSlug).toString().trim();
  const role = (row.role || '').toString().trim();
  const team = (row.team || row.deliverable || '').toString().trim();
  const time = (row.time || '').toString().trim();
  const deliverable = (row.deliverable || '').toString().trim();
  const blurb = (row.blurb || '').toString().trim();
  const tagline = (row.tagline || '').toString().trim();
  const overview = blurb || tagline;
  const emoji = (row['emoji cursor™️'] || '').toString().trim();
  const laptopMockup = (row['laptop mockup'] || '').toString().trim();
  const lightColor = (row['Light Color (Background)'] || '').toString().trim();
  const darkColor = (row['Dark Color (text)'] || '').toString().trim();
  const order = Number.parseInt(row.order || '0', 10) || 0;
  const archived = String(row.Archived || '').toLowerCase() === 'true';
  const draft = String(row.Draft || '').toLowerCase() === 'true';

  const body = sanitizeHtmlForMdx((row['Main Case Study'] || '').toString().trim());

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `slug: ${JSON.stringify(safeSlug)}`,
    `role: ${JSON.stringify(role)}`,
    `team: ${JSON.stringify(team)}`,
    `time: ${JSON.stringify(time)}`,
    `deliverable: ${JSON.stringify(deliverable)}`,
    `blurb: ${JSON.stringify(blurb)}`,
    `tagline: ${JSON.stringify(tagline)}`,
    `overview: ${JSON.stringify(overview)}`,
    `emoji: ${JSON.stringify(emoji)}`,
    `laptopMockup: ${JSON.stringify(laptopMockup)}`,
    `lightColor: ${JSON.stringify(lightColor)}`,
    `darkColor: ${JSON.stringify(darkColor)}`,
    `order: ${order}`,
    `archived: ${archived}`,
    `draft: ${draft}`,
    '---',
    '',
    body,
    '',
  ].join('\n');

  return { safeSlug, frontmatter };
}

async function main() {
  const csvText = await readFile(inputFile, 'utf8');
  const rows = parseCsv(csvText);

  await mkdir(outputDir, { recursive: true });

  for (const row of rows) {
    const { safeSlug, frontmatter } = toFrontmatter(row);
    const fileName = `${safeSlug}.mdx`;
    const outputPath = path.join(outputDir, fileName);
    await writeFile(outputPath, frontmatter, 'utf8');
  }

  console.log(`Converted ${rows.length} case studies to ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
