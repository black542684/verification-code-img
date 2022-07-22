const VerificationCode = require("./src/VerificationCode.js");

const code = VerificationCode.generateVerifyCode(4);
VerificationCode.outputImage(200, 120, __dirname + '/code.jpeg', code);
console.log("code=", code);