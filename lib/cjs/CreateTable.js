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
const createTable = (databaseName, databaseUniqueID, tableName, columnList) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the user's home directory
        const projectRoot = process.cwd();
        // Create the table folder in the user's home directory
        const rootFolder = (0, path_1.join)(projectRoot, 'databases');
        const databaseFolder = (0, path_1.join)(rootFolder, databaseName);
        const TableFolder = (0, path_1.join)(databaseFolder, tableName);
        yield fs_1.promises.mkdir(TableFolder, { recursive: true });
        // making defaults for row numbers
        const rowNumber = 0;
        // Create a JSON file inside the subfolder with the database metadata
        const metadata = {
            tableName,
            rowNumber,
            createdAt: new Date().toISOString(),
            column: columnList,
            "Rows": []
        };
        const TableDataFlePath = (0, path_1.join)(TableFolder, 'tableinfo.json');
        yield fs_1.promises.writeFile(TableDataFlePath, JSON.stringify(metadata, null, 2), 'utf8').then(() => {
            console.log("Table '" + (metadata === null || metadata === void 0 ? void 0 : metadata.tableName) + "' created successfully.");
        });
    }
    catch (error) {
        throw new Error(`Error Creating Table: ${error}`);
    }
});
exports.default = createTable;
