const puppeteer = require("puppeteer")
const axios = require("axios")

// 目标：获取https://sobooks.cc/所有书名和电子书的链接

const httpUrl = "https://sobooks.cc";

(async () => {
  const debugOptions = {
    defaultViewport: {
      width: 1400,
      height: 800
    },
    headless: false,
    slowMo: 250
  }

  const options = {
    headless: true,
  }
  const browser = await puppeteer.launch(debugOptions)

  // 进入网站，获取整个网站列表页的页数
  const getAllNum = async () => {
    const page = await browser.newPage()
    await page.goto(httpUrl)
    const pageNum = await page.$eval(".pagination li:last-child span", (element) => {
      let text = element.innerHTML;
      text = text.substring(1, text.length - 1).trim()
      return text
    })
    return pageNum
  }
  const pageNum = await getAllNum()
  console.log("pageNum", pageNum);

})();





// 获取列表页的所有链接

// 进入每个电子书的详情页获取下载电子书的网盘地址

//将获取的数据保存到book.txt文档中