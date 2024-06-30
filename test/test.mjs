import { fstat } from "fs";
// const Havocweb = require("../lib");
import { HavocwebDB } from "havocwebdblite";
const Database = new HavocwebDB("MyLocalDB", 1002);

const createDB = () => {
  Database.createLocalDB();
};
createDB();
export default Database;
