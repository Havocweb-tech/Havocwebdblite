"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HavocwebDB = void 0;
const createDatabase_1 = __importDefault(require("./createDatabase"));
const Table_1 = __importDefault(require("./Table"));
class HavocwebDB {
    constructor(databaseName, databaseUniqueID) {
        this.databaseName = databaseName;
        this.databaseUniqueID = databaseUniqueID;
    }
    static createLocalDB(databaseName, databaseUniqueID) {
        (0, createDatabase_1.default)(databaseName, databaseUniqueID);
    }
    addTable(tableName, columnList) {
        const Table = new Table_1.default(tableName, 0, columnList, [], this.databaseName);
        Table.createTable(this.databaseUniqueID);
    }
    insertIntoTable(tableName, row) {
        const Table = new Table_1.default(tableName, 0, [], [], this.databaseName);
        Table.insertRow(row);
    }
    sqlSelect(tableName, key, value) {
        const Table = new Table_1.default(tableName, 0, [], [], this.databaseName);
        const Rows = Table.select(key, value);
        return Rows;
    }
    sqlDelete(tableName, key, value) {
        const Table = new Table_1.default(tableName, 0, [], [], this.databaseName);
        Table.delete(key, value);
    }
    getTableRowCount(tableName) {
        const Table = new Table_1.default(tableName, 0, [], [], this.databaseName);
        const totalRowCount = Table.getRowCount();
        return totalRowCount;
    }
    getTableDate(tableName) {
        const Table = new Table_1.default(tableName, 0, [], [], this.databaseName);
        const createDate = Table.createdAt;
        return createDate;
    }
}
exports.HavocwebDB = HavocwebDB;
