var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { promises as fs } from 'fs';
import { join } from 'path';
const createDatabase = (databaseName, databaseUniqueID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the user's home directory
        const projectRoot = process.cwd();
        // Create the root folder in the user's home directory
        const rootFolder = join(projectRoot, 'databases');
        yield fs.mkdir(rootFolder, { recursive: true });
        // Create a subfolder inside the root folder with the database name
        const databaseFolder = join(rootFolder, databaseName);
        yield fs.mkdir(databaseFolder, { recursive: true });
        // Create a JSON file inside the subfolder with the database metadata
        const metadata = {
            databaseName,
            databaseUniqueID,
            createdAt: new Date().toISOString(),
        };
        const metadataFilePath = join(databaseFolder, 'metadata.json');
        yield fs.writeFile(metadataFilePath, JSON.stringify(metadata, null, 2), 'utf8').then(() => {
            console.log("Created Successfully name: " + (metadata === null || metadata === void 0 ? void 0 : metadata.databaseName));
            return `Database Created ${databaseName}, UniqueId: ${databaseUniqueID}`;
        });
        return `Database Created ${databaseName}, UniqueId: ${databaseUniqueID}`;
    }
    catch (error) {
        throw new Error(`Failed to create database`);
    }
});
export default createDatabase;
