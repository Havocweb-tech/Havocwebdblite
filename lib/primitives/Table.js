var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { promises as fs } from "fs";
import { join } from "path";
import addRow from "./addRow";
import crypto from 'crypto';
import { decryptAndLoad } from "./openDB";
import { encryptAndSave } from "./saveDB";
import dotenv from 'dotenv';
dotenv.config();
const ENCRYPTION_KEY = getEncryptionKey();
function getEncryptionKey() {
    let key = process.env.HAVOCWEB_DB_LITE_ENCRYPTION_KEY;
    if (!key || Buffer.from(key, 'base64').length !== 32) {
        const newKey = crypto.randomBytes(32).toString('base64');
        updateEnvFile('HAVOCWEB_DB_LITE_ENCRYPTION_KEY', newKey);
        dotenv.config();
        key = newKey;
    }
    return Buffer.from(key, 'base64');
}
function updateEnvFile(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
        const envPath = join(process.cwd(), '.env');
        const envContent = yield fs.readFile(envPath, 'utf8');
        const newEnvContent = envContent
            .split('\n')
            .filter(line => !line.startsWith(`${key}=`))
            .concat(`${key}=${value}`)
            .join('\n');
        yield fs.writeFile(envPath, newEnvContent, 'utf8');
    });
}
function encryptData(data) {
    const iv = crypto.randomBytes(16); // 16-byte IV for AES
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
}
class Tables {
    constructor(tableName, rowNumber, column, Rows, databaseName) {
        this.createTable = (databaseUniqueID) => __awaiter(this, void 0, void 0, function* () {
            try {
                const databaseName = this.databaseName;
                const tableName = this.tableName;
                const columnList = this.column;
                const createdAt = this.createdAt;
                const projectRoot = process.cwd();
                // Set up folder structure
                const rootFolder = join(projectRoot, "Database");
                const databaseFolder = join(rootFolder, databaseName);
                const tableFolder = join(databaseFolder, tableName);
                yield fs.mkdir(tableFolder, { recursive: true });
                // Default metadata
                const metadata = {
                    tableName,
                    rowNumber: 0, // Initial row count
                    createdAt,
                    column: columnList,
                    Rows: [],
                };
                const metadataString = JSON.stringify(metadata, null, 2);
                // Encrypt metadata
                const { iv, encryptedData } = encryptData(metadataString);
                // Save encrypted data and IV in table.hdblte file
                const tableFilePath = join(tableFolder, "table.hdblte");
                yield fs.writeFile(tableFilePath, JSON.stringify({ iv, encryptedData }), 'utf8');
                return "Table created successfully.";
            }
            catch (error) {
                throw new Error(`Error Creating Table: ${error}`);
            }
        });
        this.insertRow = (row) => __awaiter(this, void 0, void 0, function* () {
            const dbName = this.databaseName;
            const tbName = this.tableName;
            yield addRow(dbName, tbName, row);
        });
        this.select = (key, value) => __awaiter(this, void 0, void 0, function* () {
            let nofile = false;
            try {
                const databaseName = this.databaseName;
                const tableName = this.tableName;
                const criteria = {
                    [key]: value,
                };
                // Load file content
                const fileContent = yield decryptAndLoad(databaseName, tableName);
                // Check if fileContent is null or an empty string
                if (fileContent === null) {
                    nofile = true;
                    return [{ message: "Cannot find Table" }];
                }
                // Parse file content as JSON
                const metadata = fileContent;
                // Handle case where all rows are selected
                if (key === "*") {
                    return metadata.Rows;
                }
                // Filter rows based on criteria
                const selectedRows = metadata.Rows.filter((row) => {
                    return Object.keys(criteria).every((key) => row[key] === criteria[key]);
                });
                return selectedRows;
            }
            catch (error) {
                if (nofile) {
                    throw new Error(`Error: the table you're trying to reach isn't available: ${error}`);
                }
                throw new Error(`Error selecting row(s): ${error}`);
            }
        });
        this.delete = (key, value) => __awaiter(this, void 0, void 0, function* () {
            try {
                const databaseName = this.databaseName;
                const tableName = this.tableName;
                const criteria = { [key]: value };
                // Read the current metadata
                const fileContent = yield decryptAndLoad(databaseName, tableName);
                const metadata = fileContent;
                // Filter out rows that match the criteria
                const rowIndex = metadata.Rows.findIndex((row) => {
                    return Object.keys(criteria).every(key => row[key] === criteria[key]);
                });
                // If a row that matches the criteria is found, delete it
                if (rowIndex !== -1) {
                    metadata.Rows.splice(rowIndex, 1);
                    // Update the row count
                    metadata.rowNumber = metadata.Rows.length;
                    yield encryptAndSave(databaseName, tableName, metadata);
                    console.log('Row(s) deleted successfully');
                }
                else {
                    console.log('No matching row found');
                }
            }
            catch (error) {
                throw new Error(`Error deleting row(s): ${error}`);
            }
        });
        this.getRowCount = () => __awaiter(this, void 0, void 0, function* () {
            let nofile = false;
            try {
                const databaseName = this.databaseName;
                const tableName = this.tableName;
                // Read the current metadata
                const fileContent = yield decryptAndLoad(databaseName, tableName);
                if (fileContent === null) {
                    nofile = true;
                    return 0;
                }
                const metadata = fileContent;
                const RowCount = metadata.rowNumber;
                return RowCount;
            }
            catch (error) {
                if (nofile) {
                    throw new Error(`Error: the table you're trying to reach isn't available: ${error}`);
                }
                throw new Error(`Error deleting row(s): ${error}`);
            }
        });
        this.getTableDate = () => __awaiter(this, void 0, void 0, function* () {
            let nofile = false;
            try {
                const databaseName = this.databaseName;
                const tableName = this.tableName;
                // Read the current metadata
                const fileContent = yield decryptAndLoad(databaseName, tableName);
                if (fileContent === null) {
                    nofile = true;
                    return "File not Found";
                }
                const metadata = fileContent;
                const createdAt = metadata.createdAt;
                return createdAt;
            }
            catch (error) {
                if (nofile) {
                    throw new Error(`Error: the table you're trying to reach isn't available: ${error}`);
                }
                throw new Error(`Error deleting row(s): ${error}`);
            }
        });
        this.tableName = tableName;
        this.rowNumber = rowNumber;
        this.createdAt = new Date().toISOString();
        this.column = column;
        this.Rows = Rows;
        this.databaseName = databaseName;
    }
}
export default Tables;
