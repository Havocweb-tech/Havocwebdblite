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
const fs_1 = require("fs");
const path_1 = require("path");
const addRow = (databaseName, tableName, row) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the project's root directory
        const projectRoot = process.cwd();
        // Define the path to the metadata file
        const tableDataFilePath = (0, path_1.join)(projectRoot, 'databases', databaseName, tableName, 'tableinfo.json');
        // Read the current metadata
        const fileContent = yield fs_1.promises.readFile(tableDataFilePath, 'utf8');
        const metadata = JSON.parse(fileContent);
        // Check if all columns are filled and if there are extra columns
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
        // Write the updated metadata back to the file
        yield fs_1.promises.writeFile(tableDataFilePath, JSON.stringify(metadata, null, 2), 'utf8');
        return "Added Successfully";
    }
    catch (error) {
        throw new Error(`Error adding row: ${error}`);
    }
});
exports.default = addRow;
