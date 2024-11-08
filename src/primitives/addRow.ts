import { decryptAndLoad } from './openDB';
import { encryptAndSave } from './saveDB';

interface Row {
    [key: string]: any;
}

interface TableMetadata {
    column: string[];     // Columns in the table
    rowNumber: number;    // Current row count
    Rows: Row[];          // Existing rows
}

const addRow = async (
    databaseName: string, 
    tableName: string, 
    row: Omit<Row, 'id'>
): Promise<string> => {
    try {
        // Load the table metadata
        const metadata: TableMetadata = await decryptAndLoad(databaseName, tableName) as TableMetadata;

        // Ensure the 'column' property exists and is an array
        if (!metadata.column || !Array.isArray(metadata.column)) {
            throw new Error("Table metadata is missing a 'column' property.");
        }

        // Filter out the 'id' column
        const columnList = metadata.column.filter((column: string) => column !== 'id');
        const rowKeys = Object.keys(row);
        
        // Check for missing columns
        const missingColumns = columnList.filter((column: string) => !rowKeys.includes(column));
        if (missingColumns.length > 0) {
            throw new Error(`Missing columns: ${missingColumns.join(', ')}`);
        }

        // Check for extra columns
        const extraColumns = rowKeys.filter((key: string) => !columnList.includes(key));
        if (extraColumns.length > 0) {
            throw new Error(`Extra columns not defined in the table: ${extraColumns.join(', ')}`);
        }

        // Generate a unique ID for the new row
        const rowID = metadata.rowNumber + 1;

        // Add the new row
        const newRow = { id: rowID, ...row };
        metadata.Rows.push(newRow);
        metadata.rowNumber += 1;


        await encryptAndSave(databaseName, tableName, metadata);

        // Define the file path and write the updated metadata back to the file
        // const tableDataFilePath = join(__dirname, `${databaseName}_${tableName}.json`);
        // await fs.writeFile(tableDataFilePath, JSON.stringify(metadata, null, 2), 'utf8');

        return "Added Successfully";
    } catch (error) {
        throw new Error(`Error adding row: ${error}`);
    }
};

export default addRow;
