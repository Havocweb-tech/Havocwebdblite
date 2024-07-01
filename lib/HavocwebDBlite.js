import createDatabase from "./createDatabase";
import Tables from "./Table";
class HavocwebDB {
    constructor(databaseName, databaseUniqueID) {
        this.databaseName = databaseName;
        this.databaseUniqueID = databaseUniqueID;
    }
    createLocalDB() {
        createDatabase(this.databaseName, this.databaseUniqueID);
    }
    addTable(tableName, columnList) {
        const Table = new Tables(tableName, 0, columnList, [], this.databaseName);
        Table.createTable(this.databaseUniqueID);
    }
    insertIntoTable(tableName, row) {
        const Table = new Tables(tableName, 0, [], [], this.databaseName);
        Table.insertRow(row);
    }
    select(tableName, key, value) {
        const Table = new Tables(tableName, 0, [], [], this.databaseName);
        const Rows = Table.select(key, value);
        return Rows;
    }
    delete(tableName, key, value) {
        const Table = new Tables(tableName, 0, [], [], this.databaseName);
        Table.delete(key, value);
    }
    getTableRowCount(tableName) {
        const Table = new Tables(tableName, 0, [], [], this.databaseName);
        const totalRowCount = Table.getRowCount();
        return totalRowCount;
    }
    getTableDate(tableName) {
        const Table = new Tables(tableName, 0, [], [], this.databaseName);
        const createDate = Table.createdAt;
        return createDate;
    }
}
export { HavocwebDB };
