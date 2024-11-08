"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptAndSave = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ENCRYPTION_KEY = getEncryptionKey();
// Function to verify or generate the encryption key
function getEncryptionKey() {
    let key = process.env.HAVOCWEB_DB_LITE_ENCRYPTION_KEY;
    // Check if the key is a valid 32-byte base64 string
    if (!key || Buffer.from(key, 'base64').length !== 32) {
        const newKey = crypto_1.default.randomBytes(32).toString('base64');
        updateEnvFile('HAVOCWEB_DB_LITE_ENCRYPTION_KEY', newKey);
        dotenv_1.default.config(); // Reload .env with the updated key
        key = newKey;
    }
    return Buffer.from(key, 'base64');
}
// Update the .env file with a new key-value pair
function updateEnvFile(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
        const envPath = (0, path_1.join)(process.cwd(), '.env');
        const envContent = yield fs_1.promises.readFile(envPath, 'utf8');
        const newEnvContent = envContent
            .split('\n')
            .filter(line => !line.startsWith(`${key}=`))
            .concat(`${key}=${value}`)
            .join('\n');
        yield fs_1.promises.writeFile(envPath, newEnvContent, 'utf8');
    });
}
// AES-256-CBC encryption
const encryptData = (data, key) => {
    const iv = crypto_1.default.randomBytes(16); // Generate a random IV for each encryption
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
};
const encryptAndSave = (databaseName, tableName, data) => __awaiter(void 0, void 0, void 0, function* () {
    const projectRoot = process.cwd();
    const tableFolder = (0, path_1.join)(projectRoot, 'Database', databaseName, tableName);
    yield fs_1.promises.mkdir(tableFolder, { recursive: true });
    const jsonData = JSON.stringify(data);
    const { iv, encryptedData } = encryptData(jsonData, ENCRYPTION_KEY);
    const filePath = (0, path_1.join)(tableFolder, 'table.hdblte');
    yield fs_1.promises.writeFile(filePath, JSON.stringify({ iv, encryptedData }), 'utf8');
    console.log(`Data encrypted and saved successfully in ${filePath}`);
});
exports.encryptAndSave = encryptAndSave;
