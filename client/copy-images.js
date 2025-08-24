import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, 'hall pictures data');
const targetDir = path.join(__dirname, 'public', 'hall pictures data');

// Create the target directory if it doesn't exist
try {
  await fs.mkdir(targetDir, { recursive: true });
} catch (error) {
  if (error.code !== 'EEXIST') {
    throw error;
  }
}

// Function to copy directory recursively
async function copyDir(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

// Copy the hall pictures directory
await copyDir(sourceDir, targetDir);

console.log('Hall pictures have been copied to the public directory successfully!');
