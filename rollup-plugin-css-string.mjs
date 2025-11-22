/**
 * Rollup plugin to import CSS files as strings
 * This allows us to bundle CSS and inject it into adoptedStyleSheets
 */

import { readFile } from 'fs/promises';
import { resolve } from 'path';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

/**
 * @returns {import('rollup').Plugin}
 */
export default function cssString() {
  return {
    name: 'css-string',

    resolveId(source, importer) {
      // Handle CSS imports with ?inline query
      if (source.includes('.css?inline')) {
        // Remove query parameter for the actual file resolution
        const filePath = source.replace(/\?.*$/, '');

        // If it's a relative import, resolve it relative to the importer
        if (filePath.startsWith('.')) {
          const importerDir = importer ? resolve(importer, '..') : process.cwd();
          const resolved = resolve(importerDir, filePath);
          return resolved + '?inline'; // Add marker back for load hook
        }

        return filePath + '?inline';
      }
      return null;
    },

    async load(id) {
      // Only process files with ?inline marker
      if (!id.includes('?inline')) {
        return null;
      }

      // Remove query parameter to get actual file path
      const filePath = id.replace(/\?.*$/, '');

      // Only process CSS files
      if (!filePath.endsWith('.css')) {
        return null;
      }

      try {
        console.log(`[css-string] Processing: ${filePath}`);

        // Read the CSS file
        const css = await readFile(filePath, 'utf-8');

        // Process with PostCSS (Tailwind + Autoprefixer)
        const result = await postcss([
          tailwindcss(),
          autoprefixer()
        ]).process(css, {
          from: filePath,
          to: filePath
        });

        // Minimize CSS (basic minification)
        const minified = result.css
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
          .replace(/\s+/g, ' ') // Collapse whitespace
          .replace(/\s*([{}:;,])\s*/g, '$1') // Remove space around special chars
          .trim();

        console.log(`[css-string] Bundled ${minified.length} bytes of CSS`);

        // Return as JavaScript module that exports the CSS string
        return {
          code: `export default ${JSON.stringify(minified)};`,
          map: null
        };
      } catch (error) {
        this.error(`Failed to process CSS file ${filePath}: ${error.message}`);
      }
    }
  };
}
