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

// Encrypt data using AES-256-CBC with a random IV
function encryptData(data: string): { iv: string; encryptedData: string } {
    const iv = crypto.randomBytes(16); // AES requires a 16-byte IV
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return { iv: iv.toString('hex'), encryptedData: encrypted };
}

// Decrypt data using AES-256-CBC with the provided IV
function decryptData(encryptedData: string, iv: string): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

// Create a database, saving encrypted metadata to a .hdblte file
const createDatabase = async (databaseName: string, databaseUniqueID: string): Promise<string> => {
    try {
        const projectRoot = process.cwd();
        const rootFolder = join(projectRoot, 'Database');
        await fs.mkdir(rootFolder, { recursive: true });

        const databaseFolder = join(rootFolder, databaseName);
        await fs.mkdir(databaseFolder, { recursive: true });

        // Prepare metadata as JSON
        const metadata = {
            databaseName,
            databaseUniqueID,
            createdAt: new Date().toISOString(),
        };
        const metadataString = JSON.stringify(metadata, null, 2);

        // Encrypt metadata
        const { iv, encryptedData } = encryptData(metadataString);

        // Write both encrypted data and IV to the .hdblte file
        const metadataFilePath = join(databaseFolder, 'metadata.hdblte');
        await fs.writeFile(metadataFilePath, JSON.stringify({ iv, encryptedData }), 'utf8');

        console.log(`Database created successfully: Name: ${databaseName}`);
        return `Database Created: ${databaseName}, UniqueID: ${databaseUniqueID}`;
    } catch (error: any) {
        throw new Error(error);
    }
};

export default createDatabase;