import { promises as fs } from 'fs';
import { join } from 'path';

interface Row {
    [key: string]: any;
}

const addRow = async (
    databaseName: string, 
    tableName: string, 
    row: Omit<Row, 'id'>
): Promise<void> => {
    try {
        // Get the project's root directory
        const projectRoot = process.cwd();

        // Define the path to the metadata file
        const tableDataFilePath = join(projectRoot, 'databases', databaseName, tableName, 'tableinfo.json');

        // Read the current metadata
        const fileContent = await fs.readFile(tableDataFilePath, 'utf8');
        const metadata = JSON.parse(fileContent);
        console.log("meta: ", metadata);

        // Check if all columns are filled and if there are extra columns
        const columnList = metadata.column.filter((column: string) => column !== 'id');
        const rowKeys = Object.keys(row);
        
        console.log("got here");
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

        // Write the updated metadata back to the file
        await fs.writeFile(tableDataFilePath, JSON.stringify(metadata, null, 2), 'utf8');

        console.log(`Row added successfully with ID: ${rowID}`);
    } catch (error) {
        console.error(`Error adding row: ${error}`);
        throw new Error(`Error adding row: ${error}`);
    }
};

export default addRow;
