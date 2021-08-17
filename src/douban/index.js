// 请求 url - > html（信息）  -> 解析html
const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');
const Koa = require("koa");
const Router = require('koa-router');
const axios = require("axios");
const koaRequest = require('koa2-request')

const app = new Koa();
const router = new Router();

let html = "";

async function getData() {

  const result = await https.get('https://movie.douban.com/top250', function (res) {
    // console.log("res", res);
    // 分段返回的 自己拼接
    // 有数据产生的时候 拼接
    res.on('data', function (chunk) {
      html += chunk;
    })

    // 拼接完成
    res.on('end', function () {
      const $ = cheerio.load(html);
      let allFilms = [];
      $('li .item').each(function () {
        // this 循环时 指向当前这个电影
        // 当前这个电影下面的title
        // 相当于this.querySelector
        const title = $('.title', this).text();
        const star = $('.rating_num', this).text();
        const pic = $('.pic img', this).attr('src');

        allFilms.push({
          title,
          star,
          pic
        })
      })
      dataToJson(allFilms);
      downloadImage(allFilms);
    })
  })
}

// 把数组写入json里面
function dataToJson(allFilms) {
  // fs.access判断films.json文件是否存在
  fs.access("./films.json", fs.constants.F_OK, (err) => {
    if (err) {
      fs.writeFile('./films.json', JSON.stringify(allFilms), function (err) {
        if (!err) {
          // console.log('文件写入完毕');
        }
      })
    }
  });
}

// 下载图片
function downloadImage(allFilms) {
  allFilms.forEach((item, i) => {
    const picUrl = item.pic;
    https.get(picUrl, function (res) {
      res.setEncoding('binary');
      let str = '';
      res.on('data', function (chunk) {
        str += chunk;
      })
      res.on('end', function () {
        const imgFile = "./images";
        if (!fs.existsSync(imgFile)) {
          fs.mkdirSync(imgFile);
        }
        // 向images中写入图片
        fs.writeFile(`./images/${i}.png`, str, 'binary', function (err) {
          if (!err) {
            // console.log(`第${i}张图片下载成功`);
          }
        })
      })
    })
  })
}

app.use(async (ctx, next) => {

  await getData();
  console.log("html", html);
  next();
  ctx.response.type = 'text/html';
  ctx.response.body = html;
});

// app.use(router.routes()); //作用：启动路由
// app.use(router.allowedMethods());
app.listen(5000, () => {
  console.log('starting at port 5000');

});