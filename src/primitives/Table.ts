import { promises as fs } from "fs";
import { join } from "path";
import addRow from "./addRow";
import crypto from 'crypto';
import { decryptAndLoad } from "./openDB";
import { encryptAndSave } from "./saveDB";
import dotenv from 'dotenv';

dotenv.config();


const ENCRYPTION_KEY = getEncryptionKey();
function getEncryptionKey(): Buffer {
    let key = process.env.HAVOCWEB_DB_LITE_ENCRYPTION_KEY;

    
    if (!key || Buffer.from(key, 'base64').length !== 32) {
        const newKey = crypto.randomBytes(32).toString('base64');
        updateEnvFile('HAVOCWEB_DB_LITE_ENCRYPTION_KEY', newKey);
        dotenv.config(); 
        key = newKey;
    }
    return Buffer.from(key, 'base64');
}

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
function encryptData(data: string): { iv: string; encryptedData: string } {
    const iv = crypto.randomBytes(16); // 16-byte IV for AES
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
}

interface Row {
    [key: string]: any;
}
interface Metadata {
    tableName: string;
    rowNumber: number;
    createdAt: string;
    column: string[];
    Rows: Row[];
}
class Tables {
    tableName: string;
    rowNumber: number;
    createdAt: string;
    column: string[];
    Rows: any[];
    databaseName: string;

    constructor(
        tableName: string,
        rowNumber: number,
        column: string[],
        Rows: any[],
        databaseName: string
    ) {
        this.tableName = tableName;
        this.rowNumber = rowNumber;
        this.createdAt = new Date().toISOString();
        this.column = column;
        this.Rows = Rows;
        this.databaseName = databaseName;
    }

    createTable = async (databaseUniqueID: string): Promise<string> => {
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
        await fs.mkdir(tableFolder, { recursive: true });

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
        await fs.writeFile(tableFilePath, JSON.stringify({ iv, encryptedData }), 'utf8');

        return "Table created successfully.";
    } catch (error) {
        throw new Error(`Error Creating Table: ${error}`);
    }
    };

    insertRow = async (row: {}): Promise<void> => {
        const dbName = this.databaseName;
        const tbName = this.tableName;
        await addRow(dbName, tbName, row);
    };
    select = async (key: string, value: any): Promise<any[]> => {
        let nofile = false;
        try {
            const databaseName = this.databaseName;
            const tableName = this.tableName;
            const criteria: { [key: string]: any } = {
                [key]: value,
            };
    
            // Load file content
            const fileContent = await decryptAndLoad(databaseName, tableName);
    
            // Check if fileContent is null or an empty string
            if (fileContent === null) {
                nofile = true;
                return [{ message: "Cannot find Table" }];
            }
    
            // Parse file content as JSON
            const metadata = fileContent as Metadata;
    
            // Handle case where all rows are selected
            if (key === "*") {
                return metadata.Rows;
            }
    
            // Filter rows based on criteria
            const selectedRows = metadata.Rows.filter((row: Row) => {
                return Object.keys(criteria).every((key) => row[key] === criteria[key]);
            });
    
            return selectedRows;
        } catch (error) {
            if (nofile) {
                throw new Error(`Error: the table you're trying to reach isn't available: ${error}`);
            }
            throw new Error(`Error selecting row(s): ${error}`);
        }
    };
    
    delete = async (key: string, value: any): Promise<void> => {
        try {
            const databaseName = this.databaseName;
            const tableName = this.tableName;
            const criteria: { [key: string]: any } = { [key]: value };

            // Read the current metadata
            const fileContent = await decryptAndLoad(databaseName, tableName);
            const metadata = fileContent as Metadata;

            // Filter out rows that match the criteria
            const rowIndex = metadata.Rows.findIndex((row: Row) => {
                return Object.keys(criteria).every(key => row[key] === criteria[key]);
            });

            // If a row that matches the criteria is found, delete it
            if (rowIndex !== -1) {
                metadata.Rows.splice(rowIndex, 1);

                // Update the row count
                metadata.rowNumber = metadata.Rows.length;

                await encryptAndSave(databaseName, tableName, metadata);

                console.log('Row(s) deleted successfully');
            } else {
                console.log('No matching row found');
            }
        } catch (error) {
            throw new Error(`Error deleting row(s): ${error}`);
        }
    };
    getRowCount = async (): Promise<number> =>{
        let nofile = false;
        try{
        const databaseName = this.databaseName;
        const tableName = this.tableName;
         
         // Read the current metadata
         const fileContent = await decryptAndLoad(databaseName, tableName);
         if (fileContent === null) {
             nofile = true
             return 0;
         }
         const metadata = fileContent as Metadata;
         const RowCount = metadata.rowNumber;

         return RowCount;
        }catch(error){
            if(nofile){
                throw new Error(`Error: the table you're trying to reach isn't available: ${error}`)
            }
            throw new Error(`Error deleting row(s): ${error}`);
        }
    }
    getTableDate = async (): Promise<string> =>{
        let nofile = false;
        try{
        const databaseName = this.databaseName;
        const tableName = this.tableName;
         
         // Read the current metadata
         const fileContent = await decryptAndLoad(databaseName, tableName);
         if (fileContent === null) {
             nofile = true
             return "File not Found";
         }
         const metadata = fileContent as Metadata;
         const createdAt = metadata.createdAt;

         return createdAt;
        }catch(error){
            if(nofile){
                throw new Error(`Error: the table you're trying to reach isn't available: ${error}`)
            }
            throw new Error(`Error deleting row(s): ${error}`);
        }
    }
    static tableAvailable = async (tableName: string, dbName: string) :Promise<Boolean> => {
        const projectRoot = process.cwd();
    const databaseFolder = join(projectRoot, 'Database', dbName, tableName);

    try {
        // Check if the database folder exists
        await fs.access(databaseFolder);
        return true; // Database is available
    } catch {
        return false; // Database is not available
    }
    }
}
export default Tables;
