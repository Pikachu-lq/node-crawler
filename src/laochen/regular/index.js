const request = require("request");
const path = require("path");
const {
  fsRead,
  fsWrite,
  fsDir
} = require("./lcfs")
const {
  resolve
} = require("path");
const {
  setTimeout
} = require("timers");
const {
  log
} = require("console");
const httpUrl = "https://www.1905.com/vod/list/n_1/o3u1p1.html"

// 获取起始页面的所有分类(类型)地址
async function getClassUrl() {
  const {
    req,
    body
  } = await getRequest(httpUrl);
  // console.log(body);
  // 解析html内容
  // 正则匹配 栏目相关的内容
  const reg = /<span class="search-index-L">类型(.*?)<div class="grid-12x">/igs
  const result = reg.exec(body)[1];
  // console.log(result[1]);

  // <\/a>: \转译/
  // .*? : 匹配所有
  // const reg1 = /<a href="(.*?)".*?>(.*?)<\/a>/igs
  // 需要转译的：() . / :
  // 
  const reg1 = /<a href="javascript\:void\(0\);" onclick="location\.href='(.*?)';return false;" >(.*?)<\/a>/igs

  const arrClass = []
  let res;
  // 循环获取所有类别  exec 需要循环提取
  while (res = reg1.exec(result)) {
    if (res[2] != "全部" && res[2] != "爱情") {
      // console.log("res[2]", res[2]);

      const obj = {
        className: res[2],
        url: res[1]
      }
      arrClass.push(obj)

      // 创建类型文件夹
      await fsDir(`./movies/${res[2]}`)
      getMovies(res[1],
        res[2])
    }



  }

  // console.log("arrClass", arrClass);

}


// 通过分类，获取页面中的分类的电影链接
async function getMovies(url, movieType) {
  // console.log("电影url", url);
  const {
    req,
    body
  } = await getRequest(url)
  // <img 增加匹配度
  const reg = /<a class="pic-pack-outer" target="_blank" href="(.*?)".*?><img/igs;
  let res;
  const arrList = []
  while (res = reg.exec(body)) {
    arrList.push(res[1])
    parsePage(res[1], movieType)
  }
  // console.log("电影分类：movieType", movieType);
  // console.log("电影链接--arrList", arrList);
}

// 获取单个电影详细内容
const parsePage = async (url, movieType) => {
  const {
    req,
    body
  } = await getRequest(url)
  // console.log("传进来的url", url);
  // console.log("传进来的url", body);

  // console.log("传进来的movieType", movieType);
  // const reg =
  //   /<div class="sb-content"><div class="sb-mod-movie hidden"><h1 class="movie-title">(.*?)<\/h1>.*?class="movie-description">(.*?)/igs;
  const reg = /<h1 class="playerBox-info-name playerBox-info-cnName">(.*?)<\/h1>.*?id="playerBoxIntroCon">(.*?)<a.*?导演.*?target="\_blank" title="(.*?)" data-hrefexp/igs;

  const result = reg.exec(body)
  // console.log("result", result);
  const movie = {
    name: result[1],
    brief: result[2],
    daoyan: result[3],
    movieUrl: url,
    movieType
  }
  const strMovie = JSON.stringify(movie)
  fsWrite(`./movies/${movieType}/${result[1]||'default'}.json`, strMovie)


}

function getRequest(url) {
  return new Promise(function (resolve, reject) {
    request.get(url, (error, req, body) => {
      if (error) {
        reject(error)
      } else {
        resolve({
          req,
          body
        })
      }

    })
  })
}

getClassUrl();




// console.log("__dirname", __dirname);
// console.log("path.resolve", path.resolve("./index.json"));
// console.log("path.join", path.join("./index.json"));


async function test() {
  return 1
}

async function test2() {
  const result = await setTimeout(() => {
    console.log("setTimeout");
  }, 1000);
  await console.log(result);
  await console.log("222");
}

// console.log(test());
// console.log(test2());
// test2.then((resolve) => {
//   console.log("test2", resolve);
// })