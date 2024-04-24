const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// 使用body-parser中间件解析JSON和URL编码的请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/get-link', (req, res) => {
  // req.body现在包含了请求体中的数据
  const bodyData = req.body;

  // 使用bodyData做一些事情...
  console.log(bodyData);

  // 发送响应
  res.send({ status: 'Data received', data: bodyData });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});