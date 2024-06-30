import { promises as fs } from 'fs';
import { join } from 'path';

interface Row {
    [key: string]: any;
}

const deleteRow = async (
    databaseName: string, 
    tableName: string, 
    criteria: Partial<Row>
): Promise<void> => {
    try {
        // Get the project's root directory
        const projectRoot = process.cwd();

        // Define the path to the metadata file
        const tableDataFilePath = join(projectRoot, 'databases', databaseName, tableName, 'tableinfo.json');

        // Read the current metadata
        const fileContent = await fs.readFile(tableDataFilePath, 'utf8');
        const metadata = JSON.parse(fileContent);

        // Filter out rows that match the criteria
        const remainingRows = metadata.Rows.filter((row: Row) => {
            return !Object.keys(criteria).every(key => row[key] === criteria[key]);
        });

        // Update the row count
        metadata.rowNumber = remainingRows.length;

        // Update the metadata with the remaining rows
        metadata.rows = remainingRows;
        await fs.writeFile(tableDataFilePath, JSON.stringify(metadata, null, 2), 'utf8');

        console.log('Row(s) deleted successfully');
    } catch (error) {
        console.error(`Error deleting row(s): ${error}`);
        throw new Error(`Error deleting row(s): ${error}`);
    }
};

export default deleteRow;
