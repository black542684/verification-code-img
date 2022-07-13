const fs = require("fs");
const { randomRange } = require("./utils");
const { createCanvas, loadImage } = require('canvas');
const { Colors } = require("./Colors");

/* 
  npm install screenres --save 屏幕分辨率
*/

class VerificationCode {
  static VERIFY_CODES = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  constructor () {

  }

  /**
   * 使用指定源生成，指定位数的验证码
   * @param {int} verifySize 
   * @param {string} sources 
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
    // 添加图片扭曲
    // VerificationCode.shear(ctx, width, height, c);
    
    // 添加文字
    ctx.fillStyle = VerificationCode.getRandColor(100, 160);
    let fontSize = height - 4;
    const font = `italic ${fontSize}px Algerian`;
    ctx.font = font;
    let chars = code.split("");
    
    for (let i = 0; i < verifySize; i++) {
      AffineTransform affine = new AffineTransform();
      affine.setToRotation(Math.PI / 4 * rand.nextDouble() * (rand.nextBoolean() ? 1 : -1), (w / verifySize) * i + fontSize / 2, h / 2);
      g2.setTransform(affine);
      g2.drawChars(chars, i, 1, ((w - 10) / verifySize) * i + 5, h / 2 + fontSize / 2 - 10);
  }




    // 输出
    const stream = canvas.createJPEGStream();
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


  static shear(ctx, width, height, color) {
    VerificationCode.shearX(ctx, width, height, color);
    VerificationCode.shearY(ctx, width, height, color);
  }

  static shearX(ctx, width, height, color) {

    let period = randomRange(0, 2);

    const borderGap = true;
    const frames = 1;
    const phase = randomRange(0, 2);

    for (let i = 0; i < height; i++) {

        let d = parseInt((period >> 1)
        * Math.sin( i /  period
        + (6.2831853071795862 *  phase)
        / frames));


        // 区域复制
        const imgdata = ctx.getImageData(0, i, width, 1);
        ctx.putImageData(imgdata, d, 0);

        if (borderGap) {
          ctx.strokeStyle = color; // 设置颜色

          ctx.moveTo(d, i);
          ctx.lineTo(0, i);
          ctx.stroke();

          ctx.moveTo(d + width, i);
          ctx.lineTo(width, i);
          ctx.stroke();
        }
    }
  }

  static shearY(ctx, width, height, color) {

    const period = randomRange(0, 40) + 10; // 50;

    const borderGap = true;
    const frames = 20;
    const phase = 7;

    for (let i = 0; i < width; i++) {
        const d = parseInt((period >> 1)
        * Math.sin(i /  period
        + (6.2831853071795862 *  phase)
        /  frames));

        // 区域复制
        const imgdata = ctx.getImageData(i, 0, 1, height);
        ctx.putImageData(imgdata, 0, d);

        if (borderGap) {
          ctx.strokeStyle = color;

          ctx.moveTo(i, d);
          ctx.lineTo(i, 0);
          ctx.stroke();

          ctx.moveTo(i, d + height);
          ctx.lineTo(i, height);
          ctx.stroke();
        }

    }
  }
}

module.exports = VerificationCode;