// 请求 url - > html（信息）  -> 解析html
const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');
// 请求 top250
// 浏览器输入一个 url, get
https.get('https://movie.douban.com/top250', function (res) {
  // console.log(res);
  // 分段返回的 自己拼接
  let html = '';
  // 有数据产生的时候 拼接
  res.on('data', function (chunk) {
    console.log("chunk", chunk);
    html += chunk;
  })
  // console.log("html", html);
  // 拼接完成
  res.on('end', function () {
    console.log(html);
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

    // 把数组写入json里面
    fs.access("./films.json", fs.constants.F_OK, (err) => {
      if (err) {
        fs.writeFile('./films.json', JSON.stringify(allFilms), function (err) {
          if (!err) {
            console.log('文件写入完毕');
          }
        })
      }
    });

    // 图片下载一下
    downloadImage(allFilms);
  })
})

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