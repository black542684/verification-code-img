const fs = require("fs");
const { randomRange } = require("./utils");
const { createCanvas, loadImage } = require('canvas');
const { Colors } = require("./Colors");

/**
 * 生成验证码图片工具
 */
class VerificationCode {
  static VERIFY_CODES = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  constructor () {

  }

  /**
   * 使用指定源生成，指定位数的验证码
   * @param {int} verifySize 验证码长度
   * @param {string} sources 验证码数据源
   * @return {string}
   */
  static generateVerifyCode(verifySize, sources) {
    if (!sources || sources.length === 0) {
      sources = VerificationCode.VERIFY_CODES;
    }

    let codesLen = sources.length;

    const verifyCode = new Array();

    for (let i = 0; i < verifySize; i++) {
      const index = randomRange(0, codesLen);
      verifyCode.push(sources.charAt(index));
    }

    return verifyCode.join("");
  }


  /**
   * 输出指定验证码的图片
   * @param {int} width 图片宽度
   * @param {int} height 图片高度
   * @param {string} path 保存路径
   * @param {string} code 验证码
   */
  static outputImage(width, height, path, code) {
    // 输出流
    const out = fs.createWriteStream(path);

    let verifySize = code.length;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');  
    
    // 创建颜色集合
    const len = 5;
    const colors = new Array();
    const fractions = new Array();
    const colorSpaces = [Colors.WHITE, Colors.CYAN,
      Colors.GRAY, Colors.LIGHT_GRAY, Colors.MAGENTA, Colors.ORANGE,
      Colors.PINK, Colors.YELLOW];
    
    for (let i = 0; i < len; i++) {
      colors[i] = colorSpaces[randomRange(0, colorSpaces.length)];
      fractions[i] = Math.random();
    }

    fractions.sort();

    // 设置边框色
    ctx.fillStyle = Colors.GRAY;
    ctx.fillRect(0, 0, width, height);

    const c = VerificationCode.getRandColor(200, 250);
    ctx.fillStyle = c; // 设置颜色
    ctx.fillRect(0, 2, width, height - 4);


    // 绘制干扰线
    // 设置线条的颜色
    ctx.strokeStyle = VerificationCode.getRandColor(160, 200);

    for (let i = 0; i < 20; i++) {
      let x = randomRange(0, width - 1);
      let y = randomRange(0, height - 1);
      let xl = randomRange(0, 6) + 1;
      let yl = randomRange(0, 12) + 1;
      ctx.moveTo(x,y);
      ctx.lineTo(x + xl + 40,y + yl + 20);
      ctx.stroke();
    }

    // 添加噪点
    // 噪声率
    let yawpRate = 0.05;
    let area = parseInt(yawpRate * width * height);
    for (let i = 0; i < area; i++) {
      let x = randomRange(0, width);
      let y = randomRange(0, height);
      // 获取随机颜色
      let rgb = VerificationCode.getRandomIntColor();
      ctx.fillStyle = rgb;
      ctx.fillRect(x, y, 1, 1);
    }
    
    // 添加文字
    ctx.fillStyle = VerificationCode.getRandColor(100, 160);
    let fontSize = height / 2;
    const font = `italic ${fontSize}px Algerian`;
    ctx.font = font;
    let chars = code.split("");
    
    
    for (let i = 0; i < verifySize; i++) {      
      ctx.save();
      ctx.translate(
        (width / verifySize) * i + fontSize / 2, 
        height / 2
      ); // 设置旋转中心点
      const angle = Math.PI / 4 * Math.random() * (Math.random() > 0.5 ? 1 : -1);
      ctx.rotate(angle); // 设置旋转角度
      ctx.fillText(chars[i], 0 - fontSize / 2, 0);
      ctx.restore();
    }




    // 输出
    const stream = canvas.createJPEGStream({
      quality: 1,
      progressive: true
    });
    stream.pipe(out);
    out.on('finish', () =>  console.log('The JPEG file was created.'));

  }


  /**
   * 随机颜色
   * @param {int} start 最小值
   * @param {int} end 最大值
   */
  static getRandColor(start, end) {
    if (start > 255) {
      start = 255;
    }
    if (end > 255) {
      end = 255;
    }
    let r = randomRange(start, end);
    let g = randomRange(start, end);
    let b = randomRange(start, end);

    return `rgb(${r},${g},${b})`;
  }


  /**
   * 获取随机rgb
   * @returns {string}
   */
  static getRandomIntColor() {
    let rgb = VerificationCode.getRandomRgb();
    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  }

  /**
   * 获取随机rgb数组
   * @returns {Array}
   */
  static getRandomRgb() {
    let rgb = [];
    for (let i = 0; i < 3; i++) {
      rgb[i] = randomRange(0, 255);
    }
    return rgb;
  }
}

module.exports = VerificationCode;