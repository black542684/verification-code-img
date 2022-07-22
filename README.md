# verification-code-img
Generate captcha   

## start 
npm install

```javascript
  const code = VerificationCode.generateVerifyCode(4);
  VerificationCode.outputImage(200, 120, __dirname + '/code.jpeg', code);
```

## VerificationCode.js 是一个工具类，可以生成验证码图片，并且保存到本地
