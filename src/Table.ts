import { promises as fs } from "fs";
import { join } from "path";
import addRow from "./addRow";

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
            // Get the user's home directory
            const projectRoot = process.cwd();

            // Create the table folder in the user's home directory
            const rootFolder = join(projectRoot, "databases");
            const databaseFolder = join(rootFolder, databaseName);
            const TableFolder = join(databaseFolder, tableName);
            await fs.mkdir(TableFolder, { recursive: true });

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
            await fs.writeFile(
                TableDataFlePath,
                JSON.stringify(metadata, null, 2),
                "utf8"
            );
            return "Table created Successfully.";
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
        try{
        const databaseName = this.databaseName;
        const tableName = this.tableName;
        const criteria: { [key: string]: any } = {
            [key]: value,
        };
        // Get the project's root directory
        const projectRoot = process.cwd();

        // Define the path to the metadata file
        const tableDataFilePath = join(
            projectRoot,
            "databases",
            databaseName,
            tableName,
            "tableinfo.json"
        );

        // Read the current metadata
        const fileContent = await fs.readFile(tableDataFilePath, "utf8");
        if (fileContent === null || fileContent === "") {
            nofile = true
            return [{ message: "Cannot find Table" }];
        }
        const metadata = JSON.parse(fileContent);

        if (key === "*") {
            return metadata.Rows;
        }
        const selectedRows = metadata.Rows.filter((row: Row) => {
            return Object.keys(criteria).every((key) => row[key] === criteria[key]);
        });

        return selectedRows;
    }catch(error){
        if(nofile){
            throw new Error(`Error: the table you're trying to reach isn't available: ${error}`)
        }
        throw new Error(`Error deleting row(s): ${error}`);
    }
    };
    delete = async (key: string, value: any): Promise<void> => {
        try {
            const databaseName = this.databaseName;
            const tableName = this.tableName;
            const criteria: { [key: string]: any } = { [key]: value };

            // Get the project's root directory
            const projectRoot = process.cwd();

            // Define the path to the metadata file
            const tableDataFilePath = join(
                projectRoot,
                'databases',
                databaseName,
                tableName,
                'tableinfo.json'
            );

            // Read the current metadata
            const fileContent = await fs.readFile(tableDataFilePath, 'utf8');
            const metadata: Metadata = JSON.parse(fileContent);

            // Filter out rows that match the criteria
            const remainingRows = metadata.Rows.filter((row: Row) => {
                return !Object.keys(criteria).every(key => row[key] === criteria[key]);
            });

            // Update the row count
            metadata.rowNumber = remainingRows.length;
            console.log(remainingRows);
            // Update the metadata with the remaining rows
            metadata.Rows = remainingRows;
            await fs.writeFile(
                tableDataFilePath,
                JSON.stringify(metadata, null, 2),
                'utf8'
            );

            console.log('Row(s) deleted successfully');
        } catch (error) {
            throw new Error(`Error deleting row(s): ${error}`);
        }
    };
    getRowCount = async (): Promise<number> =>{
        let nofile = false;
        try{
        const databaseName = this.databaseName;
        const tableName = this.tableName;
         // Get the project's root directory
         const projectRoot = process.cwd();

         // Define the path to the metadata file
         const tableDataFilePath = join(
             projectRoot,
             "databases",
             databaseName,
             tableName,
             "tableinfo.json"
         );
 
         // Read the current metadata
         const fileContent = await fs.readFile(tableDataFilePath, "utf8");
         if (fileContent === null || fileContent === "") {
             nofile = true
             return 0;
         }
         const metadata = JSON.parse(fileContent);
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
         // Get the project's root directory
         const projectRoot = process.cwd();

         // Define the path to the metadata file
         const tableDataFilePath = join(
             projectRoot,
             "databases",
             databaseName,
             tableName,
             "tableinfo.json"
         );
 
         // Read the current metadata
         const fileContent = await fs.readFile(tableDataFilePath, "utf8");
         if (fileContent === null || fileContent === "") {
             nofile = true
             return "File not Found";
         }
         const metadata = JSON.parse(fileContent);
         const createdAt = metadata.createdAt;

         return createdAt;
        }catch(error){
            if(nofile){
                throw new Error(`Error: the table you're trying to reach isn't available: ${error}`)
            }
            throw new Error(`Error deleting row(s): ${error}`);
        }
    }
}
export default Tables;
