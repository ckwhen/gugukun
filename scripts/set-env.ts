import fs from 'fs';
import path from 'path';

const env = process.argv[2] || 'local';
const sourcePath = path.resolve(process.cwd(), `.env.${env}`);
const targetPath = path.resolve(process.cwd(), '.env');

if (!fs.existsSync(sourcePath)) {
  console.error(`❌ Missing ${sourcePath}`);
  process.exit(1);
}

fs.copyFileSync(sourcePath, targetPath);
console.log(`✅ Environment set to '${env}'`);
