const cheerio = require("cheerio")
const axios = require("axios")
const fs = require("fs")
const path = require("path")


// 1、获取页面总数
const getNum = async () => {
  const httpUrl = "https://www.doutula.com/article/list/?page=3"

  const result = await axios.get(httpUrl)
  const $ = cheerio.load(result.data)
  const btnLen = $(".pagination li").length
  const allNum = $(".pagination li").eq(btnLen - 2).find('a').text()
  console.log('allNum', allNum);
  // allNum 数据量太大会导致服务器崩溃，最好是定时请求
  return 3
  // return allNum
}

// 2、获取列表数据
const getListInfo = async (pageNum) => {
  const httpUrl = `https://www.doutula.com/article/list/?page=${pageNum}`
  console.log("httpUrl", httpUrl);
  const res = await axios.get(httpUrl)
  // res.data 返回html文档内容
  // console.log(res.data);

  // cheerio解析html文档
  // 获取HTML文档的内容，内容的获取跟jquery一样

  const $ = cheerio.load(res.data)
  // col-sm-9>a  col-sm-9下的第一级a标签
  $(".container .col-sm-9>a").each((i, element) => {
    // console.log($(element).attr("href"));
    const typeUrl = $(element).attr("href")
    let title = $(element).find(".random_title").text()
    const reg = /(.*?)\d/igs
    title = reg.exec(title)[1]
    // console.log("title", title);
    fs.mkdir(`./img/${title}`, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`./img/${title} 创建成功`);
      }
    })
    parsePage(typeUrl, title)
  })

}

const spider = async () => {
  console.log("spider");
  const pagesize = await getNum()
  for (let i = 1; i <= pagesize; i++) {
    getListInfo(i)
  }
}

spider()



// 3、解析图片并写入图片流
const parsePage = (async (url, title) => {
  // console.log("url", url);
  const result = await axios.get(url)
  const $ = cheerio.load(result.data)
  $(".pic-content img").each((i, element) => {
    const imgUrl = $(element).attr("src")
    // console.log(imgUrl);
    // 获取图片类型
    const picType = path.extname(imgUrl)
    // log("picType", picType)
    // const picUrl = `./img/${title}/${title}_${i}${picType}`
    const picUrl = `./img/${title}/${i}${picType}`

    // 创建图片写入流
    const ws = fs.createWriteStream(picUrl)
    // 请求图片 
    // responseType:"stream" 数据以流的形式返回
    axios.get(imgUrl, {
      responseType: "stream"
    }).then((res) => {
      res.data.pipe(ws)
      console.log(`图片加载完成${picUrl}`);
      // 判断图片流是否写入完成，完成后关闭写入流，否则会一直调用
      res.data.on('close', () => {
        ws.close()
      })
    })
  })

})