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
  // 页面截屏
  // await page.screenshot({
  //   path: "screenshot.png"
  // })

  /**
   *  $$eval函数使得我们的回调函数可以运行在浏览器中，并且可以通过浏览器的方式输出
   *  获取页面元素内容
   */
  // 
  const elementsList = await page.$$eval("#menu li a", (elements) => {
    // 在浏览器上运行
    let eles = []
    elements.forEach((item, i) => {
      //打印输出在打开的对应浏览器中
      // console.log(item.innerHTML);
      // console.log(item.innerText);
      let eleObj = {}
      if (item.getAttribute("href") != "#") {
        eleObj = {
          href: item.getAttribute("href"),
          text: item.innerText
        }
        eles.push(eleObj)
      }
      // console.log("eles", eles);
    })

    return eles
  })


  // 浏览器可以监听控制台的输出
  // 监听console事件
  // page.on("console", (...args) => {
  //   console.log("args", args);
  // })

  // 打印在终端
  console.log("elementsList", elementsList);

  // 打开国内电影页面
  const gnPage = await browser.newPage()
  await gnPage.goto(elementsList[2].href)



}

puppeteerFun()

// axios.get("https://www.dytt8.net/").then((res) => {
//   console.log("res", res);
// })