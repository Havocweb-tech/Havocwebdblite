import { promises as fs } from 'fs';
import { join } from 'path';

interface Row {
    [key: string]: any;
}

const selectRows = async (
    databaseName: string, 
    tableName: string, 
    criteria: Partial<Row>
): Promise<Row[]> => {
    try {
        // Get the project's root directory
        const projectRoot = process.cwd();

        // Define the path to the metadata file
        const tableDataFilePath = join(projectRoot, 'databases', databaseName, tableName, 'tableinfo.json');

        // Read the current metadata
        const fileContent = await fs.readFile(tableDataFilePath, 'utf8');
        const metadata = JSON.parse(fileContent);
        const criteriaCheck = Object.keys(criteria);
        if (criteriaCheck.length < 1){
            return metadata.Rows;
        }
        // Filter rows based on criteria
        const selectedRows = metadata.Rows.filter((row: Row) => {
            return Object.keys(criteria).every(key => row[key] === criteria[key]);
        });

        return selectedRows;
    } catch (error) {
        console.error(`Error selecting rows: ${error}`);
        throw new Error(`Error selecting rows: ${error}`);
    }
};

export default selectRows;
