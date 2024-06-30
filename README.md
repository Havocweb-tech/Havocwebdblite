# HavocwebDBLite

HavocwebDBLite is a simple and lightweight Node.js module for creating and managing local JSON-based databases. It allows you to create databases, tables, add rows, select rows, and delete rows using a simple and intuitive API.

## Installation

You can install the module using npm:

```sh
npm install havocwebdblite
```

## Usage

### Importing the Module

First, import the necessary functions from the module:

```typescript
import createTable from 'havocwebdblite/src/createDatabase/createDatabase';
import addRow from 'havocwebdblite/src/updateDatabase/addRow';
import selectRows from 'havocwebdblite/src/selectDatabase/selectRows';
import deleteRow from 'havocwebdblite/src/updateDatabase/deleteRow';
```

### Creating a Table

To create a new table, use the `createTable` function. Provide the database name, a unique database ID, the table name, and a list of columns.

```typescript
const createTable = async () => {
    await createTable('myDatabase', 'unique-id-12345', 'myTable', ['id', 'name', 'email']);
    console.log('Table created successfully');
};

createTable();
```

### Adding Rows

To add a new row to a table, use the `addRow` function. Provide the database name, table name, and the row data (excluding the `id`, which is generated automatically).

```typescript
const addRows = async () => {
    await addRow('myDatabase', 'myTable', { name: 'Wisdom', email: 'sample@gmail.com' });
    await addRow('myDatabase', 'myTable', { name: 'Bob', email: 'bob@gmail.com' });
    await addRow('myDatabase', 'myTable', { name: 'Alice', email: 'alice@gmail.com' });
    console.log('Rows added successfully');
};

addRows();
```

### Selecting Rows

To select rows from a table based on specific criteria, use the `selectRows` function. Provide the database name, table name, and the criteria as a partial row object.

```typescript
const selectExample = async () => {
    const rowsByName = await selectRows('myDatabase', 'myTable', { name: 'Bob' });
    console.log('Rows selected by name:', rowsByName);

    const rowsByEmail = await selectRows('myDatabase', 'myTable', { email: 'alice@gmail.com' });
    console.log('Rows selected by email:', rowsByEmail);

    const rowsByNameAndEmail = await selectRows('myDatabase', 'myTable', { name: 'Wisdom', email: 'sample@gmail.com' });
    console.log('Rows selected by name and email:', rowsByNameAndEmail);
};

selectExample();
```

### Deleting Rows

To delete rows from a table based on specific criteria, use the `deleteRow` function. Provide the database name, table name, and the criteria as a partial row object.

```typescript
const deleteExample = async () => {
    await deleteRow('myDatabase', 'myTable', { name: 'Bob' });
    console.log('Row(s) deleted successfully');
};

deleteExample();
```

## Testing

To test the module, you can create a `test` directory with test files. Here's an example of how to structure your test file to create, add, select, and delete rows:

```typescript
import createTable from 'havocwebdblite/src/createDatabase/createDatabase';
import addRow from 'havocwebdblite/src/updateDatabase/addRow';
import selectRows from 'havocwebdblite/src/selectDatabase/selectRows';
import deleteRow from 'havocwebdblite/src/updateDatabase/deleteRow';

const testHavocwebDBLite = async () => {
    try {
        await createTable('myDatabase', 'unique-id-12345', 'myTable', ['id', 'name', 'email']);
        await addRow('myDatabase', 'myTable', { name: 'Wisdom', email: 'sample@gmail.com' });
        await addRow('myDatabase', 'myTable', { name: 'Bob', email: 'bob@gmail.com' });
        await addRow('myDatabase', 'myTable', { name: 'Alice', email: 'alice@gmail.com' });

        const rowsBeforeDeletion = await selectRows('myDatabase', 'myTable', {});
        console.log('Rows before deletion:', rowsBeforeDeletion);

        await deleteRow('myDatabase', 'myTable', { name: 'Bob' });

        const rowsAfterDeletion = await selectRows('myDatabase', 'myTable', {});
        console.log('Rows after deletion:', rowsAfterDeletion);

        console.log('Test completed successfully');
    } catch (error) {
        console.error(`Test failed: ${error.message}`);
    }
};

testHavocwebDBLite();
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with any improvements or bug fixes.

## License

This project is licensed under the MIT License.
```