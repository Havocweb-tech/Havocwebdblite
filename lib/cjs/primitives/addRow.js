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
Object.defineProperty(exports, "__esModule", { value: true });
const openDB_1 = require("./openDB");
const saveDB_1 = require("./saveDB");
const addRow = (databaseName, tableName, row) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Load the table metadata
        const metadata = yield (0, openDB_1.decryptAndLoad)(databaseName, tableName);
        // Ensure the 'column' property exists and is an array
        if (!metadata.column || !Array.isArray(metadata.column)) {
            throw new Error("Table metadata is missing a 'column' property.");
        }
        // Filter out the 'id' column
        const columnList = metadata.column.filter((column) => column !== 'id');
        const rowKeys = Object.keys(row);
        // Check for missing columns
        const missingColumns = columnList.filter((column) => !rowKeys.includes(column));
        if (missingColumns.length > 0) {
            throw new Error(`Missing columns: ${missingColumns.join(', ')}`);
        }
        // Check for extra columns
        const extraColumns = rowKeys.filter((key) => !columnList.includes(key));
        if (extraColumns.length > 0) {
            throw new Error(`Extra columns not defined in the table: ${extraColumns.join(', ')}`);
        }
        // Generate a unique ID for the new row
        const rowID = metadata.rowNumber + 1;
        // Add the new row
        const newRow = Object.assign({ id: rowID }, row);
        metadata.Rows.push(newRow);
        metadata.rowNumber += 1;
        yield (0, saveDB_1.encryptAndSave)(databaseName, tableName, metadata);
        // Define the file path and write the updated metadata back to the file
        // const tableDataFilePath = join(__dirname, `${databaseName}_${tableName}.json`);
        // await fs.writeFile(tableDataFilePath, JSON.stringify(metadata, null, 2), 'utf8');
        return "Added Successfully";
    }
    catch (error) {
        throw new Error(`Error adding row: ${error}`);
    }
});
exports.default = addRow;
