
<br/>
<p align="center">
  <img src="icon.jpeg" alt="HavocwebDBLite" width="190" height="190">
</p>

<h1 align="center">HavocwebDBLite</h1>

<p align="center">
  HavocwebDBLite 📀 is a simple and lightweight Node.js module for creating and managing local JSON-based databases. It allows you to create databases, tables, add rows, select rows, and delete rows using a simple and intuitive API.
  <br/>
  <br/>
  <a href="https://chat.whatsapp.com/HLDCujp5dInCPW8m4HOJBa">Join the Community</a> |
  <a href="https://github.com/Havocweb-tech/Havocwebdblite/issues">Report a Bug</a> |
  <a href="https://github.com/Havocweb-tech/Havocwebdblite/issues">Request a Feature</a>
</p>

![Contributors](https://img.shields.io/github/contributors/Havocweb-tech/Havocwebdblite?color=dark-green)
[![npm Version](https://img.shields.io/npm/v/havocwebdblite.svg)](https://www.npmjs.com/package/havocwebdblite)
![Forks](https://img.shields.io/github/forks/Havocweb-tech/Havocwebdblite?style=social)
![Stargazers](https://img.shields.io/github/stars/Havocweb-tech/Havocwebdblite?style=social)

---

## Installation

You can install the module using npm or yarn:

**NPM:**
```sh
npm i havocwebdblite
```

**Yarn:**
```sh
yarn add havocwebdblite
```

## Usage

### Importing the Module

First, import the `HavocwebDB` class from the module:

```javascript
import HavocwebDB from "havocwebdblite";
```

If you're using CommonJS, you would need to require the module like this:

```javascript
const HavocwebDB = require('havocwebdblite');
```

### Initializing the Database

To initialize the database, you need to use the `HavocwebDB` class:

```javascript
const Database = new HavocwebDB(databaseName: string, databaseUniqueID: any);
```

### Creating a Table

To create a new table, use the `addTable` method. Provide the table name and a list of columns:

```javascript
const createTable = async () => {
    Database.addTable(tableName: string, columnList: Array[]);
};

createTable();
```

### Adding Rows

To add a new row to a table, use the `insertIntoTable` method. Provide the table name and the row data (excluding the `id`, which is generated automatically):

```javascript
const addRows = async () => {
    Database.insertIntoTable(tableName: string, Row: {});
};

addRows();
```

### Selecting Rows

To select rows from a table based on specific criteria, use the `select` method. It's similar to SQL syntax where you use:

```sql
SELECT column FROM table WHERE key = value
```

Here's how to use the `select` function in this module:

```javascript
const selectExample = async () => {
    const selectingRowsWithSpecificValue = await Database.select(tableName: string, key: string, value: string);
    const selectingAllTableRows = await Database.select(tableName: string, "*", "");
    console.log("Specifics", selectingRowsWithSpecificValue, "All Details", selectingAllTableRows);
};

selectExample();
```

### Deleting Rows

To delete rows from a table based on specific criteria, use the `delete` method. Provide the table name and the key-value pair:

```javascript
const deleteExample = async () => {
    Database.delete(tableName: string, key: string, value: string);
    console.log('Row(s) deleted successfully');
};

deleteExample();
```

## Testing

To test the module, you can create a `test` directory with test files. Here's an example of how to structure your test file to create, add, select, and delete rows assuming you are working with an Express server:

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
    const { name, email, password } = req.body;
    Database.insertIntoTable("UserTable", { name, email, password });
    res.json({ message: "Adding user successful" });
});

router.get("/getAllUsers", async (req, res) => {
    const UserList = await Database.select("UserTable", "*", "");
    res.send(UserList);
});

router.post("/getUser", async (req, res) => {
    const { email } = req.body;
    const UserList = await Database.select("UserTable", "email", email);
    const narrowedDownUsers = UserList[0];
    res.json({ users: UserList, narrowed: narrowedDownUsers });
});

router.post("/deleteRow", async (req, res) => {
    const { password } = req.body;
    await Database.delete("UserTable", "password", password);
    res.json({ message: "Account deletion successful" });
});

module.exports = router;
```

---

## What's New (1.0.0)

### Security

All databases are now encrypted upon creation, so you can rest assured that your project won't leak data in case of a security breach.

### Static Functions

All `HavocwebDB` functions are now available as static methods. You no longer need to instantiate the `HavocwebDB` class before using them—simply call the static functions.

### Requirements

- The project requires *environmental variables*.
- Ensure you're installing the latest version of the module.
- `fs` module is required.

### Installation

Same as above.

### Setup

Create a `.env` file with the following format:

```env
HAVOCWEB_DB_LITE_ENCRYPTION_KEY=BASE64_32_BYTE_STRING
HAVOCWEB_DB_NAME=NAME
HAVOCWEB_DB_UNIQUE_ID=UNIQUE_ID
```

Although we automatically generate the encryption key for you in the `.env` file, it’s important to modify or create your own if you want to customize it.

Make sure to enter a name and unique ID for your database before creating it.

---

### Using the Query Method

```typescript
import HavocwebDB from "havocwebdblite";

const result = await HavocwebDB.query("CREATE TABLE users (id INTEGER, name TEXT, age INTEGER)");
console.log(result);
// Expected output: "Table users created successfully with columns: id, name, age"

const result = await HavocwebDB.query("INSERT INTO users (id, name, age) VALUES (1, 'John', 30)");
console.log(result);
// Expected output: "Inserted into users"

const result = await HavocwebDB.query("SELECT * FROM users WHERE name = 'John'");
console.log(result);
// Expected output: [ { id: 1, name: 'John', age: 30 } ]

const result = await HavocwebDB.query("DELETE FROM users WHERE name = 'John'");
console.log(result);
// Expected output: "Deleted from users"
```

---

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code to be distributed under the MIT license. You also implicitly verify that all code is your original work.

## License

This project is licensed under the MIT License.