const fs = require("fs")

function fsRead(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, {
      flag: "r",
      encoding: "utf-8"
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function fsWrite(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, {
      flag: "a",
      encoding: "utf-8"
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
// 创建目录
const fsDir = (path) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve("成功创建目录")
      }
    })
  })
}

module.exports = {
  fsRead,
  fsWrite,
  fsDir
}