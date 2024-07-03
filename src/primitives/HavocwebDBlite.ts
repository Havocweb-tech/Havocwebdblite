import createDatabase from "./createDatabase";
import Tables from "./Table";
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
        const Table = new Tables(tableName, 0, columnList, [], this.databaseName);
        Table.createTable(this.databaseUniqueID);
    }
    insertIntoTable(tableName: string, row: {}): void{
        const Table = new Tables(tableName, 0, [], [], this.databaseName);
        Table.insertRow(row);
        
    }
    sqlSelect(tableName: string, key: string, value: string): Promise<any[]>{
        const Table = new Tables(tableName, 0, [], [], this.databaseName)
        const Rows = Table.select(key, value);
        return Rows;
    }
    sqlDelete(tableName: string, key: string, value: string): void{
        const Table = new Tables(tableName, 0, [], [], this.databaseName);
        Table.delete(key, value);
    }
    getTableRowCount(tableName: string): Promise<number>{
        const Table = new Tables(tableName, 0, [], [], this.databaseName);
        const totalRowCount = Table.getRowCount();
        return totalRowCount;
    }
    getTableDate(tableName: string): string{
        const Table = new Tables(tableName, 0, [], [], this.databaseName);
        const createDate = Table.createdAt
        return createDate;
    }

}
export {HavocwebDB};