<br/>
<p align="center">
     <img src="icon.jpeg" alt="HavocwebDBLite" width="190" height="190">

  <h1 align="center">HavocwebDBLite</h1>

  <p align="center">
    HavocwebDBLite 📀 -- is a simple and lightweight Node.js module for creating and managing local JSON-based databases. It allows you to create databases, tables, add rows, select rows, and delete rows using a simple and intuitive API.
    <br/>
    <br/>
    <br/>
    <a href="https://chat.whatsapp.com/HLDCujp5dInCPW8m4HOJBa">Join Community</a>
    .
    <a href="https://github.com/Havocweb-tech/Havocwebdblite/issues">Report Bug</a>
    .
    <a href="https://github.com/Havocweb-tech/Havocwebdblite/issues">Request Feature</a>
  </p>
</p>

![Contributors](https://img.shields.io/github/contributors/Havocweb-tech/Havocwebdblite?color=dark-green)
[![npm Version](https://img.shields.io/npm/v/Havocwebdblite.svg)](https://www.npmjs.com/package/Havocwebdblite)
![Forks](https://img.shields.io/github/forks/Havocweb-tech/Havocwebdblite?style=social)
![Stargazers](https://img.shields.io/github/stars/Havocweb-tech/Havocwebdblite?style=social)

--

## Installation

You can install the module using npm or yarn:

NPM:

```sh
npm i havocwebdblite
```

YARN: 

```sh
yarn add havocwebdblite
```

## Usage

### Importing the Module

First, import the HavocwebDB class from the module:

```javascript
import HavocwebDB from "havocwebdblite"
```
if you're using a commonJS file you would need to normally require the module.

```javascript
const HavocwebDB = require('havocwebdblite');
```
### Initializing the Database
To Initialize the database you would have to use the `HavocwebDB` class from the module.

```javascript
const Database = new HavocwebDB(databaseName: string, databaseUniqueID: any);
```
### Creating a Table

To create a new table, use the `createTable` method. Provide the database name, a unique database ID, the table name, and a list of columns.

```javascript
const createTable = async () => {
    Database.addTable(tableName: string, columnList: Array[]);
};

createTable();
```

### Adding Rows

To add a new row to a table, use the `insertIntoTable` method. Provide the table name, and the row data (excluding the `id`, which is generated automatically).

```javascript
const addRows = async () => {
    Database.insertIntoTable(tableName: string, Row: {});
};

addRows();
```

### Selecting Rows

To select rows from a table based on specific criteria, like mySQL when we want to select a row we use 
```sql
SELECT column FROM table WHERE key = value
```
 in this case the slect function uses the table name as well and the `data` and `value`. use the `select(tableName, key, value)` method this way. Provide the table name, the key you want to filter by and the value the key is supposed to have.

```javascript
const selectExample = async () => {
    const selectingRowsWithASpecificValue = await Database.select(tableName: string, key: string, value: string);
    const selectingAllTableRows = await Database.select(tableName: string, "*", "");
    console.log("Specifics", selectingRowsWithASpecificValue, "allDetails", selectingAllTableRows)
};

selectExample();
```

### Deleting Rows

To delete rows from a table based on specific criteria, use the `delete` function. Provide the table name, and the key and Value.

```javascript
const deleteExample = async () => {
    Database.delete(tableName: string, key: string, value: string);
    console.log('Row(s) deleted successfully');
};

deleteExample();
```

## Testing

To test the module, you can create a `test` directory with test files. Here's an example of how to structure your test file to create, add, select, and delete rows assuming you were working on an Express server:

```javascript
const express = require('express');
const HavocwebDB = require('havocwebdblite');

const router = express.Router();

const Database = new HavocwebDB.HavocwebDB('userTestDatabase', 200100200);

router.post('/createTable', (req, res) => {
    Database.addTable("UserTable", ["email", "name", "password"]);
    res.json({message: "Table created"});
});
router.post('/addUser', (req, res) => {
    const {name, email, password} = req.body;
    Database.insertIntoTable("UserTable", {name, email, password});

    res.json({message: "adding user successful"});
});
router.get("/getAllUsers", async (req, res) => {
    const UserList = await Database.select("UserTable", "*", "");

    res.send(UserList);
});
router.post("/getUser", async (req, res)=>{
    const {email} = req.body;
    const UserList = await Database.select("UserTable", "email", email);

    const narrowedDownUsers = UserList[0];

    res.json({users: UserList, narrowed: narrowedDownUsers});
})
router.post("/deleteRow", async (req, res)=>{
    const {password} = req.body;
    await Database.delete("UserTable", "password", password);
    res.json({message: "account delete successful"});
})
module.exports = router;
```

## Contribution and License Agreement
If you contribute code to this project, you are implicitly allowing your code to be distributed under the MIT license. You are also implicitly verifying that all code is your original work.

## License

This project is licensed under the MIT License.