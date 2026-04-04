import fs from 'fs';
import path from 'path';

const componentsPath = path.join(process.cwd(), 'src', 'components');
const files = fs.readdirSync(componentsPath);

files.forEach(file => {
  if(!file.endsWith('.tsx')) return;
  const filePath = path.join(componentsPath, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = content
    .replace(/bg-slate-200\/50/g, 'bg-white/[0.04]')
    .replace(/bg-slate-[0-9]{3}\/[0-9]{2}/g, 'bg-white/[0.04]')
    .replace(/bg-slate-200/g, 'bg-white/[0.05]')
    .replace(/backdrop-blur-sm/g, 'backdrop-blur-[24px]')
    .replace(/border-slate-[0-9]{3}/g, 'border-white/[0.08]')
    .replace(/text-slate-800/g, 'text-white')
    .replace(/text-slate-[0-9]{3}/g, 'text-white/50')
    .replace(/text-gray-[0-9]{3}/g, 'text-white/40')
    .replace(/placeholder-slate-[0-9]{3}/g, 'placeholder-white/30');

  if(modified !== content) {
    fs.writeFileSync(filePath, modified);
    console.log('Updated ' + file);
  }
});
console.log('Done.');
