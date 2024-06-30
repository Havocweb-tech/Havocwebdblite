export class HavocwebDB {
    constructor(databaseName: any, databaseUniqueID: any);
    databaseName: any;
    databaseUniqueID: any;
    createLocalDB(): void;
    addTable(tableName: any, columnList: any): void;
    insertIntoTable(tableName: any, row: any): void;
    selectRow(tableName: any, criteria: any): any;
    deleteRow(tableName: any, criteria: any): void;
}
