import Database from "./test.mjs";
const SelectRow = async () => {
  const Info = await Database.selectRow("users", {});
  console.log(Info);
};
SelectRow();
