// Utilitários para decodificação de códigos de barras de balança

interface WeightedBarcodeResult {
  sku: string;
  weightKg?: number;
  priceTotal?: number;
  plu?: string;
  type: 'weight' | 'price';
  rawBarcode: string;
}

interface PLUMapping {
  plu: string;
  sku: string;
  name: string;
  pricePerKg: number;
  type: 'weight' | 'price';
}

/**
 * Decodifica códigos de barras de balança (EAN-13 variável e GS1 DataBar)
 */
export function parseWeightedBarcode(
  barcode: string, 
  mapping: PLUMapping[]
): WeightedBarcodeResult | null {
  
  // Limpar código
  const cleanBarcode = barcode.replace(/\D/g, '');
  
  // Tentar EAN-13 variável primeiro
  const ean13Result = parseEAN13Variable(cleanBarcode, mapping);
  if (ean13Result) return ean13Result;
  
  // Tentar GS1 DataBar
  const gs1Result = parseGS1DataBar(barcode, mapping);
  if (gs1Result) return gs1Result;
  
  return null;
}

/**
 * Decodifica EAN-13 variável
 * Formato comum: 2PPPPPWWWWWC
 * - 2: Prefixo fixo
 * - PPPPP: PLU (5 dígitos)  
 * - WWWWW: Peso em gramas (5 dígitos) ou preço em centavos
 * - C: Check digit
 */
function parseEAN13Variable(barcode: string, mapping: PLUMapping[]): WeightedBarcodeResult | null {
  if (barcode.length !== 13) return null;
  
  // Verificar prefixo (2 para peso variável)
  if (!barcode.startsWith('2')) return null;
  
  // Extrair PLU (posições 1-5)
  const plu = barcode.substring(1, 6);
  
  // Extrair valor (posições 6-10)
  const valueStr = barcode.substring(6, 11);
  const value = parseInt(valueStr);
  
  // Buscar mapeamento
  const pluMap = mapping.find(m => m.plu === plu);
  if (!pluMap) return null;
  
  let result: WeightedBarcodeResult = {
    sku: pluMap.sku,
    plu,
    type: pluMap.type,
    rawBarcode: barcode
  };
  
  if (pluMap.type === 'weight') {
    // Valor em gramas, converter para kg
    result.weightKg = value / 1000;
  } else {
    // Valor em centavos, converter para reais
    result.priceTotal = value / 100;
  }
  
  return result;
}

/**
 * Decodifica GS1 DataBar
 * Formato: (01)GTIN(3103)PESO ou (01)GTIN(3922)PREÇO
 */
function parseGS1DataBar(barcode: string, mapping: PLUMapping[]): WeightedBarcodeResult | null {
  // Regex para GS1 DataBar
  const gs1Regex = /\(01\)(\d{14})\((\d{2})(\d{2})\)(\d+)/;
  const match = barcode.match(gs1Regex);
  
  if (!match) return null;
  
  const [, gtin, ai1, ai2, value] = match;
  const ai = ai1 + ai2;
  const numValue = parseInt(value);
  
  // Extrair PLU do GTIN (últimos 5 dígitos antes do check digit)
  const plu = gtin.substring(8, 13);
  
  // Buscar mapeamento
  const pluMap = mapping.find(m => m.plu === plu);
  if (!pluMap) return null;
  
  let result: WeightedBarcodeResult = {
    sku: pluMap.sku,
    plu,
    type: pluMap.type,
    rawBarcode: barcode
  };
  
  // Decodificar por AI (Application Identifier)
  if (ai === '3103') {
    // Peso em gramas com 3 decimais
    result.weightKg = numValue / 1000;
    result.type = 'weight';
  } else if (ai === '3922' || ai === '3921') {
    // Preço em centavos
    result.priceTotal = numValue / 100;
    result.type = 'price';
  } else {
    return null; // AI não suportado
  }
  
  return result;
}

/**
 * Valida um código EAN-13
 */
export function validateEAN13(barcode: string): boolean {
  if (!/^\d{13}$/.test(barcode)) return false;
  
  const digits = barcode.split('').map(Number);
  const checkDigit = digits.pop()!;
  
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += digits[i] * (i % 2 === 0 ? 1 : 3);
  }
  
  const calculatedCheck = (10 - (sum % 10)) % 10;
  return calculatedCheck === checkDigit;
}

/**
 * Gera mapeamento PLU de exemplo para testes
 */
export function generateSamplePLUMapping(): PLUMapping[] {
  return [
    {
      plu: '12345',
      sku: 'BANANA_PRATA',
      name: 'Banana Prata',
      pricePerKg: 4.90,
      type: 'weight'
    },
    {
      plu: '12346',
      sku: 'MACA_GALA',
      name: 'Maçã Gala',
      pricePerKg: 8.50,
      type: 'weight'
    },
    {
      plu: '12347',
      sku: 'QUEIJO_MINAS',
      name: 'Queijo Minas',
      pricePerKg: 32.90,
      type: 'weight'
    },
    {
      plu: '12348',
      sku: 'BOLO_CHOCOLATE',
      name: 'Bolo de Chocolate',
      pricePerKg: 0, // Preço fixo por unidade
      type: 'price'
    }
  ];
}

/**
 * Testa a decodificação com códigos de exemplo
 */
export function testBarcodeDecoding(): void {
  const mapping = generateSamplePLUMapping();
  
  // Teste EAN-13 peso (2kg de banana)
  const weightCode = '2123450200000'; // PLU 12345, 2000g
  const weightResult = parseWeightedBarcode(weightCode, mapping);
  console.log('Peso:', weightResult);
  
  // Teste EAN-13 preço (R$ 15,50 de bolo)
  const priceCode = '2123481550000'; // PLU 12348, R$ 15,50
  const priceResult = parseWeightedBarcode(priceCode, mapping);
  console.log('Preço:', priceResult);
  
  // Teste GS1 DataBar peso
  const gs1Code = '(01)07891234567890(3103)001500'; // 1.5kg
  const gs1Result = parseWeightedBarcode(gs1Code, mapping);
  console.log('GS1:', gs1Result);
}
