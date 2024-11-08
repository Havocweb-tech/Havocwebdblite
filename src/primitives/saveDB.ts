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
