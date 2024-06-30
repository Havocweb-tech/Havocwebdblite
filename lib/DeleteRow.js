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
const deleteRow = (databaseName, tableName, criteria) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the project's root directory
        const projectRoot = process.cwd();
        // Define the path to the metadata file
        const tableDataFilePath = join(projectRoot, 'databases', databaseName, tableName, 'tableinfo.json');
        // Read the current metadata
        const fileContent = yield fs.readFile(tableDataFilePath, 'utf8');
        const metadata = JSON.parse(fileContent);
        // Filter out rows that match the criteria
        const remainingRows = metadata.Rows.filter((row) => {
            return !Object.keys(criteria).every(key => row[key] === criteria[key]);
        });
        // Update the row count
        metadata.rowNumber = remainingRows.length;
        // Update the metadata with the remaining rows
        metadata.rows = remainingRows;
        yield fs.writeFile(tableDataFilePath, JSON.stringify(metadata, null, 2), 'utf8');
        console.log('Row(s) deleted successfully');
    }
    catch (error) {
        console.error(`Error deleting row(s): ${error}`);
        throw new Error(`Error deleting row(s): ${error}`);
    }
});
export default deleteRow;
