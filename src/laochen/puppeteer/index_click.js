const {
  default: axios
} = require("axios")
const puppeteer = require("puppeteer")


async function puppeteerFun() {
  /**
   *  puppeteer.launch实例开启浏览器
   *  puppeteer.launch可以传入一个options对象
   *  headless 有/无界面浏览器
   */
  const options = {
    // 设置screenshot截图图片大小
    defaultViewport: {
      width: 1400,
      height: 800
    },
    headless: false
  }
  const browser = await puppeteer.launch(options)
  // 打开新页面
  const page = await browser.newPage()
  // 访问页面
  // https://www.dytt8.net/ https://www.baidu.com
  await page.goto("https://www.dytt8.net/")

  // 获取页面对象
  const elementsList = await page.$$("#menu li a")
  elementsList[2].click()


}

puppeteerFun()