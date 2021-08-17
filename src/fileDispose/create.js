const fs = require("fs");
const name = process.argv[2] || "default";

const jsonData = {
  usingComponents: {},
  navigationBarTitleText: "title"
}

const jsData = {
  data: {},
  onLoad: function (options) {}
}
try {
  fs.mkdirSync(`./pages/${name}`, err => {
    if (err) {
      console.log("已经存在同名page");
      return false;
    }
  })
} catch (error) {
  console.log("已经存在同名page");
}


fs.writeFileSync(
  `./pages/${name}/${name}.js`,
  `Page(${JSON.stringify(jsData,null,2)})`,
  "utf-8",
  error => {
    if (error) {
      console.log("writeFileSync--JS--error");
      return false;
    }
  }
);

fs.writeFileSync(
  `./pages/${name}/${name}.json`,
  `${JSON.stringify(jsonData, null, 2)}`,
  "utf8",
  error => {
    if (error) {
      console.log("writeFileSync--JSON--error");

      return false;
    }
  }
);
fs.writeFileSync(`./pages/${name}/${name}.wxml`, "", "utf8", error => {
  if (error) {
    return false;
  }
});
fs.writeFileSync(`./pages/${name}/${name}.wxss`, "", "utf8", error => {
  if (error) {
    return false;
  }
});
fs.writeFileSync(`./pages/${name}/${name}.less`, "", "utf8", error => {
  if (error) {
    return false;
  }
})