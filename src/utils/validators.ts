export function onlyDigits(s: string) {
    return (s || "").replace(/\D+/g, "");
  }
  
  export function isValidEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }
  
  // CPF/CNPJ simples (checagem dígitos + DV); pode ser trocado por libs br-validations
  export function isValidCPF(cpf: string) {
    cpf = onlyDigits(cpf);
    if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let sum = 0; for (let i=0; i<9; i++) sum += parseInt(cpf.charAt(i))*(10-i);
    let r = 11 - (sum%11); if (r >= 10) r = 0; if (r !== parseInt(cpf.charAt(9))) return false;
    sum = 0; for (let i=0; i<10; i++) sum += parseInt(cpf.charAt(i))*(11-i);
    r = 11 - (sum%11); if (r >= 10) r = 0; return r === parseInt(cpf.charAt(10));
  }
  
  export function isValidCNPJ(cnpj: string) {
    cnpj = onlyDigits(cnpj);
    if (!cnpj || cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0,length);
    const digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) return false;
    length = length + 1;
    numbers = cnpj.substring(0,length);
    sum = 0;
    pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    return result === parseInt(digits.charAt(1));
  }
  