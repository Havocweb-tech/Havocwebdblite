import Database from "./test.mjs";
const createTable = () => {
  Database.addTable("users", ["name", "age", "email"]);
};
createTable();
