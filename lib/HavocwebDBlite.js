import createDatabase from "./createDatabase";
import createTable from "./CreateTable";
import addRow from "./addRow";
import selectRows from "./selectRow";
import deleteRow from "./DeleteRow";
class HavocwebDB {
    constructor(databaseName, databaseUniqueID) {
        this.databaseName = databaseName;
        this.databaseUniqueID = databaseUniqueID;
    }
    createLocalDB() {
        createDatabase(this.databaseName, this.databaseUniqueID);
    }
    addTable(tableName, columnList) {
        createTable(this.databaseName, this.databaseUniqueID, tableName, columnList);
    }
    insertIntoTable(tableName, row) {
        addRow(this.databaseName, tableName, row);
    }
    selectRow(tableName, criteria) {
        const Rows = selectRows(this.databaseName, tableName, criteria);
        return Rows;
    }
    deleteRow(tableName, criteria) {
        deleteRow(this.databaseName, tableName, criteria);
    }
}
export { HavocwebDB };
