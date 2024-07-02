export class HavocwebDB {
    constructor(databaseName: any, databaseUniqueID: any);
    databaseName: any;
    databaseUniqueID: any;
    createLocalDB(): void;
    addTable(tableName: any, columnList: any): void;
    insertIntoTable(tableName: any, row: any): void;
    select(tableName: any, key: any, value: any): any;
    delete(tableName: any, key: any, value: any): void;
    getTableRowCount(tableName: any): any;
    getTableDate(tableName: any): string;
}
