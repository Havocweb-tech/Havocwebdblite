import Database from "./test.mjs";
const insertRow = () => {
  const row = {
    name: "wesley 2",
    age: 23,
    email: "wisdomema@gmail.com",
  };
  Database.insertIntoTable("users", row);
};
insertRow();
