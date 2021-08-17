const fs = require("fs");
const firstPage = "loading";
let files = fs.readFileSync("./app.json", "utf-8");
// console.log("files", files);

if (files) {
  let tempObj = JSON.parse(files);
  tempObj.pages = readPages("./pages");

  fs.writeFileSync("./app.json", JSON.stringify(tempObj), "utf-8")

}

function readPages(hasPath) {
  const tempNamesArr = [];
  const files = fs.readdirSync(hasPath);
  files.map(item => {
    tempNamesArr.push(`pages/${item}/${item}`)
  })
  tempNamesArr.unshift(`pages/${firstPage}/${firstPage}`)
  return tempNamesArr
}