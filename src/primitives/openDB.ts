import { promises as fs } from 'fs';
import { join } from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const ENCRYPTION_KEY = getEncryptionKey();

// Function to verify or generate the encryption key
function getEncryptionKey(): Buffer {
    let key = process.env.HAVOCWEB_DB_LITE_ENCRYPTION_KEY;

    // Check if the key is a valid 32-byte base64 string
    if (!key || Buffer.from(key, 'base64').length !== 32) {
        const newKey = crypto.randomBytes(32).toString('base64');
        updateEnvFile('HAVOCWEB_DB_LITE_ENCRYPTION_KEY', newKey);
        dotenv.config(); // Reload .env with the updated key
        key = newKey;
    }

    return Buffer.from(key, 'base64');
}

// Update the .env file with a new key-value pair
async function updateEnvFile(key: string, value: string): Promise<void> {
    const envPath = join(process.cwd(), '.env');
    const envContent = await fs.readFile(envPath, 'utf8');
    const newEnvContent = envContent
        .split('\n')
        .filter(line => !line.startsWith(`${key}=`))
        .concat(`${key}=${value}`)
        .join('\n');
    await fs.writeFile(envPath, newEnvContent, 'utf8');
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
