import { pathToFileURL, fileURLToPath } from 'url';
import path from 'path';
import { readFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const TS_EXTS = ['.ts', '.tsx'];

function resolveAlias(specifier) {
  if (specifier.startsWith('@shared/')) {
    return path.resolve(rootDir, 'shared', specifier.slice('@shared/'.length) + '.ts');
  }
  if (specifier.startsWith('@/')) {
    return path.resolve(rootDir, 'client/src', specifier.slice('@/'.length) + '.ts');
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  // Handle @shared and @/ aliases
  const alias = resolveAlias(specifier);
  if (alias) {
    return { url: pathToFileURL(alias).href, shortCircuit: true };
  }

  // For relative imports without extension, try .ts first
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    const parentDir = context.parentURL
      ? path.dirname(fileURLToPath(context.parentURL))
      : rootDir;
    for (const ext of TS_EXTS) {
      const candidate = path.resolve(parentDir, specifier + ext);
      try {
        readFileSync(candidate);
        return { url: pathToFileURL(candidate).href, shortCircuit: true };
      } catch { /* not found, continue */ }
    }
    // Also try without adding extension (might already have one)
    for (const ext of TS_EXTS) {
      if (specifier.endsWith(ext)) {
        const candidate = path.resolve(parentDir, specifier);
        try {
          readFileSync(candidate);
          return { url: pathToFileURL(candidate).href, shortCircuit: true };
        } catch { /* not found */ }
      }
    }
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  const filePath = url.startsWith('file://') ? fileURLToPath(url) : null;
  if (filePath && TS_EXTS.some(ext => filePath.endsWith(ext))) {
    const { transform } = require('sucrase');
    const source = readFileSync(filePath, 'utf8');
    const { code } = transform(source, {
      transforms: ['typescript'],
      disableESTransforms: true,
      filePath,
    });
    return { format: 'module', source: code, shortCircuit: true };
  }
  return nextLoad(url, context);
}
