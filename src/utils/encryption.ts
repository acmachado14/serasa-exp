import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptionService {
  private readonly secretKey: string;
  private readonly isProduction: boolean;

  constructor() {
    this.secretKey = process.env.ENCRYPTION_KEY || 'secret-key';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  encrypt(text: string): string {
    if (!this.isProduction) return text;
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  decrypt(encryptedText: string): string {
    if (!this.isProduction) return encryptedText;
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  encryptObject(obj: any): any {
    if (!this.isProduction) return obj;
    const stringified = JSON.stringify(obj);
    return this.encrypt(stringified);
  }

  decryptObject(encryptedObj: string): any {
    if (!this.isProduction) return encryptedObj;
    const decrypted = this.decrypt(encryptedObj);
    return JSON.parse(decrypted);
  }
}
