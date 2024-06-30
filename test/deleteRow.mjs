import Database from "./test.mjs";
const DeleteRow = () => {
  Database.deleteRow("users", { email: "wisdom@2030.com" });
};
DeleteRow();
