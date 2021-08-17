const fs = require("fs")
const dirName = process.argv[2]
console.log(dirName);
// fs.mkdirSync("./" + dirName);
// process.chdir("./" + dirName)
fs.mkdirSync("css")
fs.writeFileSync("css/style.css", "")
process.exit(0)