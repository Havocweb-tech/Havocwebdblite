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
const selectRows = (databaseName, tableName, criteria) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the project's root directory
        const projectRoot = process.cwd();
        // Define the path to the metadata file
        const tableDataFilePath = (0, path_1.join)(projectRoot, 'databases', databaseName, tableName, 'tableinfo.json');
        // Read the current metadata
        const fileContent = yield fs_1.promises.readFile(tableDataFilePath, 'utf8');
        if (fileContent === null || fileContent === "") {
            return [{ message: "Cannot find Table" }];
        }
        const metadata = JSON.parse(fileContent);
        const criteriaCheck = Object.keys(criteria);
        if (criteriaCheck.length < 1) {
            return metadata.Rows;
        }
        // Filter rows based on criteria
        const selectedRows = metadata.Rows.filter((row) => {
            return Object.keys(criteria).every(key => row[key] === criteria[key]);
        });
        return selectedRows;
    }
    catch (error) {
        console.error(`Error selecting rows: ${error}`);
        throw new Error(`Error selecting rows: ${error}`);
    }
});
exports.default = selectRows;
