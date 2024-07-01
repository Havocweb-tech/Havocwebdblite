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
class Tables {
    constructor(tableName, rowNumber, column, Rows, databaseName) {
        this.createTable = (databaseUniqueID) => __awaiter(this, void 0, void 0, function* () {
            try {
                const databaseName = this.databaseName;
                const tableName = this.tableName;
                const columnList = this.column;
                const createdAt = this.createdAt;
                // Get the user's home directory
                const projectRoot = process.cwd();
                // Create the table folder in the user's home directory
                const rootFolder = join(projectRoot, "databases");
                const databaseFolder = join(rootFolder, databaseName);
                const TableFolder = join(databaseFolder, tableName);
                yield fs.mkdir(TableFolder, { recursive: true });
                // making defaults for row numbers
                const rowNumber = 0;
                // Create a JSON file inside the subfolder with the database metadata
                const metadata = {
                    tableName,
                    rowNumber,
                    createdAt,
                    column: columnList,
                    Rows: [],
                };
                const TableDataFlePath = join(TableFolder, "tableinfo.json");
                yield fs.writeFile(TableDataFlePath, JSON.stringify(metadata, null, 2), "utf8");
                return "Table created Successfully.";
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
                // Get the project's root directory
                const projectRoot = process.cwd();
                // Define the path to the metadata file
                const tableDataFilePath = join(projectRoot, "databases", databaseName, tableName, "tableinfo.json");
                // Read the current metadata
                const fileContent = yield fs.readFile(tableDataFilePath, "utf8");
                if (fileContent === null || fileContent === "") {
                    nofile = true;
                    return [{ message: "Cannot find Table" }];
                }
                const metadata = JSON.parse(fileContent);
                if (key === "*") {
                    return metadata.Rows;
                }
                const selectedRows = metadata.Rows.filter((row) => {
                    return Object.keys(criteria).every((key) => row[key] === criteria[key]);
                });
                return selectedRows;
            }
            catch (error) {
                if (nofile) {
                    throw new Error(`Error: the table you're trying to reach isn't available: ${error}`);
                }
                throw new Error(`Error deleting row(s): ${error}`);
            }
        });
        this.delete = (key, value) => __awaiter(this, void 0, void 0, function* () {
            try {
                const databaseName = this.databaseName;
                const tableName = this.tableName;
                const criteria = { [key]: value };
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
                console.log(remainingRows);
                // Update the metadata with the remaining rows
                metadata.Rows = remainingRows;
                yield fs.writeFile(tableDataFilePath, JSON.stringify(metadata, null, 2), 'utf8');
                console.log('Row(s) deleted successfully');
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
                // Get the project's root directory
                const projectRoot = process.cwd();
                // Define the path to the metadata file
                const tableDataFilePath = join(projectRoot, "databases", databaseName, tableName, "tableinfo.json");
                // Read the current metadata
                const fileContent = yield fs.readFile(tableDataFilePath, "utf8");
                if (fileContent === null || fileContent === "") {
                    nofile = true;
                    return 0;
                }
                const metadata = JSON.parse(fileContent);
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
                // Get the project's root directory
                const projectRoot = process.cwd();
                // Define the path to the metadata file
                const tableDataFilePath = join(projectRoot, "databases", databaseName, tableName, "tableinfo.json");
                // Read the current metadata
                const fileContent = yield fs.readFile(tableDataFilePath, "utf8");
                if (fileContent === null || fileContent === "") {
                    nofile = true;
                    return "File not Found";
                }
                const metadata = JSON.parse(fileContent);
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
