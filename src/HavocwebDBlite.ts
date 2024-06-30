import createDatabase from "./createDatabase";
import createTable from "./CreateTable";
import addRow from "./addRow";
import selectRows from "./selectRow";
import deleteRow from "./DeleteRow";
class HavocwebDB {
    databaseName: string;
    databaseUniqueID: string;

    constructor(databaseName: string, databaseUniqueID: string){
        this.databaseName = databaseName;
        this.databaseUniqueID = databaseUniqueID;
    }
    
    createLocalDB(): void {
        createDatabase(this.databaseName, this.databaseUniqueID);
    }
    addTable(tableName: string, columnList: string[]): void{
        createTable(this.databaseName, this.databaseUniqueID, tableName, columnList);
    }
    insertIntoTable(tableName: string, row: {}): void{
        addRow(this.databaseName, tableName, row);
    }
    selectRow(tableName: string, criteria: {}): Promise<any[]>{
        const Rows = selectRows(this.databaseName, tableName, criteria);
        return Rows;
    }
    deleteRow(tableName: string, criteria: {}): void{
        deleteRow(this.databaseName, tableName, criteria);
    }
}
export {HavocwebDB};