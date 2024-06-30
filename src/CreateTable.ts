import { promises as fs } from 'fs';
import { join } from 'path';

const createTable = async (databaseName: string, databaseUniqueID: string, tableName: string, columnList: string[]): Promise<void> => {
    try {
        // Get the user's home directory
        const projectRoot = process.cwd();

        // Create the table folder in the user's home directory
        const rootFolder = join(projectRoot, 'databases');
        const databaseFolder = join(rootFolder, databaseName);
        const TableFolder = join(databaseFolder, tableName);
        await fs.mkdir(TableFolder, { recursive: true });


        // making defaults for row numbers
        const rowNumber = 0;
        // Create a JSON file inside the subfolder with the database metadata
        const metadata = {
            tableName,
            rowNumber,
            createdAt: new Date().toISOString(),
            column: columnList,
            "Rows": []

            
        };
        const TableDataFlePath = join(TableFolder, 'tableinfo.json');
        await fs.writeFile(TableDataFlePath, JSON.stringify(metadata, null, 2), 'utf8').then(() => {
            console.log("Table '"+ metadata?.tableName+"' created successfully.");
        });

    } catch (error) {
        throw new Error(`Error Creating Table: ${error}`);
    }
};

export default createTable;
