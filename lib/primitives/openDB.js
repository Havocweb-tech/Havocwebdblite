var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { promises as fs } from 'fs';
import { join } from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'base64');
if (ENCRYPTION_KEY.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes (base64 encoded).");
}
// AES-256-CBC decryption
const decryptData = (encryptedData, iv, key) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
export const decryptAndLoad = (databaseName, tableName) => __awaiter(void 0, void 0, void 0, function* () {
    const projectRoot = process.cwd();
    const filePath = join(projectRoot, 'Database', databaseName, tableName, 'table.hdblte');
    if (!filePath) {
        return null;
    }
    const fileContent = yield fs.readFile(filePath, 'utf8');
    const { iv, encryptedData } = JSON.parse(fileContent);
    const decryptedData = decryptData(encryptedData, iv, ENCRYPTION_KEY);
    return JSON.parse(decryptedData);
});
