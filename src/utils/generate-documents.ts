export class GenerateDocuments {
  private static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private static calculateCPFDigit(numbers: number[]): number {
    let sum = 0;
    let weight = numbers.length + 1;

    for (const number of numbers) {
      sum += number * weight;
      weight--;
    }

    const digit = 11 - (sum % 11);
    return digit > 9 ? 0 : digit;
  }

  private static calculateCNPJDigit(numbers: number[]): number {
    const weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;

    for (let i = 0; i < numbers.length; i++) {
      sum += numbers[i] * weights[i];
    }

    const digit = 11 - (sum % 11);
    return digit > 9 ? 0 : digit;
  }

  static generateCPF(): string {
    const numbers: number[] = [];

    // Gera os 9 primeiros dígitos
    for (let i = 0; i < 9; i++) {
      numbers.push(this.generateRandomNumber(0, 9));
    }

    // Calcula o primeiro dígito verificador
    numbers.push(this.calculateCPFDigit(numbers));

    // Calcula o segundo dígito verificador
    numbers.push(this.calculateCPFDigit(numbers));

    return numbers.join('');
  }

  static generateCNPJ(): string {
    const numbers: number[] = [];

    // Gera os 12 primeiros dígitos
    for (let i = 0; i < 12; i++) {
      numbers.push(this.generateRandomNumber(0, 9));
    }

    // Calcula o primeiro dígito verificador
    numbers.push(this.calculateCNPJDigit(numbers));

    // Calcula o segundo dígito verificador
    numbers.push(this.calculateCNPJDigit(numbers));

    return numbers.join('');
  }

  static generateDocument(type: 'cpf' | 'cnpj'): string {
    return type === 'cpf' ? this.generateCPF() : this.generateCNPJ();
  }
}
