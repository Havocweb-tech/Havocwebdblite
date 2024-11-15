"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createDatabase_1 = __importDefault(require("./primitives/createDatabase"));
const createDatabase_2 = require("./primitives/createDatabase");
const Table_1 = __importDefault(require("./primitives/Table"));
const dotenv_1 = __importDefault(require("dotenv"));
const openDB_1 = require("./primitives/openDB");
// Load environment variables from the .env file
dotenv_1.default.config();
// Assert that DATABASE_NAME and DATABASE_UNIQUE_ID are non-null strings
const DATABASE_NAME = process.env.HAVOCWEB_DB_NAME;
const DATABASE_UNIQUE_ID = process.env.HAVOCWEB_DB_UNIQUE_ID;
if (!DATABASE_NAME || !DATABASE_UNIQUE_ID) {
    throw new Error("DATABASE_NAME or DATABASE_UNIQUE_ID is not defined in the environment variables");
}
class HavocwebDB {
    constructor() {
        // Use environment variables for database name and unique ID
        this.databaseName = DATABASE_NAME;
        this.databaseUniqueID = DATABASE_UNIQUE_ID;
    }
    static createLocalDB() {
        (0, createDatabase_1.default)(DATABASE_NAME, DATABASE_UNIQUE_ID);
    }
    static addTable(tableName, columnList) {
        const Table = new Table_1.default(tableName, 0, columnList, [], DATABASE_NAME);
        Table.createTable(DATABASE_UNIQUE_ID);
    }
    static insertIntoTable(tableName, row) {
        const Table = new Table_1.default(tableName, 0, [], [], DATABASE_NAME);
        Table.insertRow(row);
    }
    static sqlSelect(tableName, key, value) {
        const Table = new Table_1.default(tableName, 0, [], [], DATABASE_NAME);
        return Table.select(key, value);
    }
    static sqlDelete(tableName, key, value) {
        const Table = new Table_1.default(tableName, 0, [], [], DATABASE_NAME);
        Table.delete(key, value);
    }
    static getTableRowCount(tableName) {
        const Table = new Table_1.default(tableName, 0, [], [], DATABASE_NAME);
        return Table.getRowCount();
    }
    static getTableDate(tableName) {
        const Table = new Table_1.default(tableName, 0, [], [], DATABASE_NAME);
        return Table.createdAt;
    }
    static isDatabaseAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, createDatabase_2.available)();
            return res;
        });
    }
    static isTableAvailable(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield Table_1.default.tableAvailable(tableName, DATABASE_NAME);
            return res;
        });
    }
    static getTableFile(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, openDB_1.decryptAndLoad)(DATABASE_NAME, tableName);
            return res;
        });
    }
    static query(sqlString) {
        return __awaiter(this, void 0, void 0, function* () {
            const [command, ...rest] = sqlString.trim().split(/\s+/);
            switch (command.toUpperCase()) {
                case 'CREATE': {
                    const match = sqlString.match(/CREATE TABLE (\w+)\s*\(([^)]+)\)/i);
                    if (match) {
                        const tableName = match[1];
                        const columns = match[2]
                            .split(',')
                            .map(col => col.trim().split(/\s+/)[0]); // Extract column names only
                        HavocwebDB.addTable(tableName, columns);
                        return `Table ${tableName} created successfully with columns: ${columns.join(', ')}`;
                    }
                    throw new Error("Invalid CREATE TABLE syntax");
                }
                case 'INSERT': {
                    const match = sqlString.match(/INSERT INTO (\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
                    if (match) {
                        const tableName = match[1];
                        const columns = match[2].split(',').map(col => col.trim());
                        const values = match[3].split(',').map(val => val.trim().replace(/'/g, ''));
                        const row = Object.fromEntries(columns.map((col, idx) => [col, values[idx]]));
                        HavocwebDB.insertIntoTable(tableName, row);
                        return `Inserted into ${tableName}`;
                    }
                    throw new Error("Invalid INSERT syntax");
                }
                case 'SELECT': {
                    const match = sqlString.match(/SELECT \* FROM (\w+)\s*WHERE\s*(\w+)\s*=\s*'([^']+)'/i);
                    if (match) {
                        const tableName = match[1];
                        const key = match[2];
                        const value = match[3];
                        return HavocwebDB.sqlSelect(tableName, key, value);
                    }
                    throw new Error("Invalid SELECT syntax");
                }
                case 'DELETE': {
                    const match = sqlString.match(/DELETE FROM (\w+)\s*WHERE\s*(\w+)\s*=\s*'([^']+)'/i);
                    if (match) {
                        const tableName = match[1];
                        const key = match[2];
                        const value = match[3];
                        HavocwebDB.sqlDelete(tableName, key, value);
                        return `Deleted from ${tableName}`;
                    }
                    throw new Error("Invalid DELETE syntax");
                }
                default:
                    throw new Error(`Unsupported query command: ${command}`);
            }
        });
    }
}
exports.default = HavocwebDB;
