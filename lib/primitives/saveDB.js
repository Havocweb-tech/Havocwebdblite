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
const ENCRYPTION_KEY = Buffer.from(process.env.HAVOCWEB_DB_LITE_ENCRYPTION_KEY, 'base64');
if (ENCRYPTION_KEY.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes (base64 encoded).");
}
// AES-256-CBC encryption
const encryptData = (data, key) => {
    const iv = crypto.randomBytes(16); // Generate a random IV for each encryption
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
};
export const encryptAndSave = (databaseName, tableName, data) => __awaiter(void 0, void 0, void 0, function* () {
    const projectRoot = process.cwd();
    const tableFolder = join(projectRoot, 'Database', databaseName, tableName);
    yield fs.mkdir(tableFolder, { recursive: true });
    const jsonData = JSON.stringify(data);
    const { iv, encryptedData } = encryptData(jsonData, ENCRYPTION_KEY);
    const filePath = join(tableFolder, 'metadata.hdblte');
    yield fs.writeFile(filePath, JSON.stringify({ iv, encryptedData }), 'utf8');
    console.log(`Data encrypted and saved successfully in ${filePath}`);
});
