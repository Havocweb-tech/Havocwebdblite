import { promises as fs } from 'fs';
import { join } from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const ENCRYPTION_KEY = Buffer.from(process.env.HAVOCWEB_DB_LITE_ENCRYPTION_KEY as string, 'base64');
if (ENCRYPTION_KEY.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes (base64 encoded).");
}

// AES-256-CBC encryption
const encryptData = (data: string, key: Buffer): { iv: string; encryptedData: string } => {
    const iv = crypto.randomBytes(16);  // Generate a random IV for each encryption
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return { iv: iv.toString('hex'), encryptedData: encrypted };
};

export const encryptAndSave = async (databaseName: string, tableName: string, data: object): Promise<void> => {
    const projectRoot = process.cwd();
    const tableFolder = join(projectRoot, 'Database', databaseName, tableName);

    await fs.mkdir(tableFolder, { recursive: true });

    const jsonData = JSON.stringify(data);
    const { iv, encryptedData } = encryptData(jsonData, ENCRYPTION_KEY);

    const filePath = join(tableFolder, 'metadata.hdblte');
    await fs.writeFile(filePath, JSON.stringify({ iv, encryptedData }), 'utf8');

    console.log(`Data encrypted and saved successfully in ${filePath}`);
};
