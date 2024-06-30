import { promises as fs } from 'fs';
import { join } from 'path';

const createDatabase = async (databaseName: string, databaseUniqueID: string): Promise<string> => {
    try {
        // Get the user's home directory
        const projectRoot = process.cwd();

        // Create the root folder in the user's home directory
        const rootFolder = join(projectRoot, 'databases');
        await fs.mkdir(rootFolder, { recursive: true });

        // Create a subfolder inside the root folder with the database name
        const databaseFolder = join(rootFolder, databaseName);
        await fs.mkdir(databaseFolder, { recursive: true });

        // Create a JSON file inside the subfolder with the database metadata
        const metadata = {
            databaseName,
            databaseUniqueID,
            createdAt: new Date().toISOString(),
        };
        const metadataFilePath = join(databaseFolder, 'metadata.json');
        await fs.writeFile(metadataFilePath, JSON.stringify(metadata, null, 2), 'utf8').then(() => {
            console.log("Created Successfully name: "+ metadata?.databaseName);
            return `Database Created ${databaseName}, UniqueId: ${databaseUniqueID}`;
        });

        return `Database Created ${databaseName}, UniqueId: ${databaseUniqueID}`;
    } catch (error) {
        throw new Error(`Failed to create database`);
    }
};

export default createDatabase;
