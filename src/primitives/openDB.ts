import { promises as fs } from 'fs';
import { join } from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const ENCRYPTION_KEY = Buffer.from(process.env.HAVOCWEB_DB_LITE_ENCRYPTION_KEY as string, 'base64');
if (ENCRYPTION_KEY.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes (base64 encoded).");
}

// AES-256-CBC decryption
const decryptData = (encryptedData: string, iv: string, key: Buffer): string => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

export const decryptAndLoad = async (databaseName: string, tableName: string): Promise<object | null> => {
    const projectRoot = process.cwd();
    const filePath = join(projectRoot, 'Database', databaseName, tableName, 'table.hdblte');
    if(!filePath){
        return null;
    }

    const fileContent = await fs.readFile(filePath, 'utf8');
    const { iv, encryptedData } = JSON.parse(fileContent);

    const decryptedData = decryptData(encryptedData, iv, ENCRYPTION_KEY);
    return JSON.parse(decryptedData);
};
