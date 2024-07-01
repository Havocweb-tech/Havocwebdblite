export default Tables;
declare class Tables {
    constructor(tableName: any, rowNumber: any, column: any, Rows: any, databaseName: any);
    createTable: (databaseUniqueID: any) => any;
    insertRow: (row: any) => any;
    select: (key: any, value: any) => any;
    delete: (key: any, value: any) => any;
    getRowCount: () => any;
    getTableDate: () => any;
    tableName: any;
    rowNumber: any;
    createdAt: string;
    column: any;
    Rows: any;
    databaseName: any;
}
