const fs = require('fs');

// Ler o arquivo original
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Substituir import
content = content.replace(
  'import PricingToggle from "@/components/PricingToggle";',
  'import PricingSection from "@/components/PricingSection";'
);

// Remover todas as linhas que contêm event handlers
const lines = content.split('\n');
const filteredLines = [];
let skipNext = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Se a linha contém event handler, pular ela e as próximas até o fechamento
  if (line.includes('onMouseEnter') || line.includes('onMouseLeave')) {
    // Pular até encontrar o fechamento
    while (i < lines.length && !lines[i].includes('}>')) {
      i++;
    }
    // Pular também a linha com o fechamento
    if (i < lines.length) i++;
    // Adicionar o fechamento correto
    if (i < lines.length) {
      filteredLines.push(lines[i].replace(/^\s*/, '              ') + '>');
    }
  } else {
    filteredLines.push(line);
  }
}

// Substituir a seção pricing completa
let newContent = filteredLines.join('\n');

// Encontrar e substituir a seção pricing
const pricingStart = newContent.indexOf('      {/* Pricing */}');
const demoStart = newContent.indexOf('      {/* Demo */}');

if (pricingStart !== -1 && demoStart !== -1) {
  const before = newContent.substring(0, pricingStart);
  const after = newContent.substring(demoStart);
  
  newContent = before + '      {/* Pricing */}\n      <PricingSection />\n\n' + after;
}

// Escrever o arquivo corrigido
fs.writeFileSync('src/app/page.tsx', newContent);

console.log('Arquivo corrigido com sucesso!');