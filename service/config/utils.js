// const crypto = require('crypto');

// function generateRandomString() {
//   return crypto.randomBytes(20).toString('hex');
// }

function generateRandomString() {
  // 随机字符池，包含大小写字母和数字
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  let charactersLength = characters.length;
  
  // 确保5位字符串中没有重复字符
  do {
    randomString = '';
    for (let i = 0; i < 5; i++) {
      // 随机选择一个字符，并添加到结果字符串中
      const randomChar = characters.charAt(Math.floor(Math.random() * charactersLength));
      randomString += randomChar;
    }
    // 对结果字符串进行排序，检查是否有重复字符
  } while (randomString.split('').sort().join('') !== randomString);

  return randomString;
}

module.exports ={
    generateRandomString
}
// const randomHexString = generateRandomHexString();
// console.log(randomHexString);