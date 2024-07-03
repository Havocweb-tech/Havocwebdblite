export class HavocwebDB {
    constructor(databaseName: any, databaseUniqueID: any);
    databaseName: any;
    databaseUniqueID: any;
    createLocalDB(): void;
    addTable(tableName: any, columnList: any): void;
    insertIntoTable(tableName: any, row: any): void;
    sqlSelect(tableName: any, key: any, value: any): any;
    sqlDelete(tableName: any, key: any, value: any): void;
    getTableRowCount(tableName: any): any;
    getTableDate(tableName: any): string;
}
