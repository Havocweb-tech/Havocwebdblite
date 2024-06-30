"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HavocwebDB = void 0;
const createDatabase_1 = __importDefault(require("./createDatabase"));
const CreateTable_1 = __importDefault(require("./CreateTable"));
const addRow_1 = __importDefault(require("./addRow"));
const selectRow_1 = __importDefault(require("./selectRow"));
const DeleteRow_1 = __importDefault(require("./DeleteRow"));
class HavocwebDB {
    constructor(databaseName, databaseUniqueID) {
        this.databaseName = databaseName;
        this.databaseUniqueID = databaseUniqueID;
    }
    createLocalDB() {
        (0, createDatabase_1.default)(this.databaseName, this.databaseUniqueID);
    }
    addTable(tableName, columnList) {
        (0, CreateTable_1.default)(this.databaseName, this.databaseUniqueID, tableName, columnList);
    }
    insertIntoTable(tableName, row) {
        (0, addRow_1.default)(this.databaseName, tableName, row);
    }
    selectRow(tableName, criteria) {
        const Rows = (0, selectRow_1.default)(this.databaseName, tableName, criteria);
        return Rows;
    }
    deleteRow(tableName, criteria) {
        (0, DeleteRow_1.default)(this.databaseName, tableName, criteria);
    }
}
exports.HavocwebDB = HavocwebDB;
