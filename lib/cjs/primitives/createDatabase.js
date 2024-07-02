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
const createDatabase = (databaseName, databaseUniqueID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the user's home directory
        const projectRoot = process.cwd();
        // Create the root folder in the user's home directory
        const rootFolder = (0, path_1.join)(projectRoot, 'databases');
        yield fs_1.promises.mkdir(rootFolder, { recursive: true });
        // Create a subfolder inside the root folder with the database name
        const databaseFolder = (0, path_1.join)(rootFolder, databaseName);
        yield fs_1.promises.mkdir(databaseFolder, { recursive: true });
        // Create a JSON file inside the subfolder with the database metadata
        const metadata = {
            databaseName,
            databaseUniqueID,
            createdAt: new Date().toISOString(),
        };
        const metadataFilePath = (0, path_1.join)(databaseFolder, 'metadata.json');
        yield fs_1.promises.writeFile(metadataFilePath, JSON.stringify(metadata, null, 2), 'utf8').then(() => {
            console.log("Created Successfully name: " + (metadata === null || metadata === void 0 ? void 0 : metadata.databaseName));
            return `Database Created ${databaseName}, UniqueId: ${databaseUniqueID}`;
        });
        return `Database Created ${databaseName}, UniqueId: ${databaseUniqueID}`;
    }
    catch (error) {
        throw new Error(`Failed to create database`);
    }
});
exports.default = createDatabase;
