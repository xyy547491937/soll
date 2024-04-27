const express = require('express');
const bodyParser = require('body-parser');
const dayjs = require('dayjs')
const app = express();
const cors = require('cors');
const { connection, executeQuery, selectData } = require("./sql")
const { generateRandomString } = require("./config/utils")
const { Response, successResponse, ErrorResponse } = require('./config/response');
const PORT = process.env.PORT || 3000;
// 使用body-parser中间件解析JSON和URL编码的请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 允许所有域名访问
app.use(cors());

// 或者，你可以指定允许的域名：
app.use((err, req, res, next) => {
  if (err) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Allow', 'GET, HEAD, OPTIONS, POST');
  next();
});

async function invite_reward_result(address, exactReason, res, message) {
  let rr = await selectData(address)
  if (rr.length > 0) {
    res.send(successResponse(Object.assign(rr[0], exactReason), message ? message : "查询成功"))
  } else {
    res.send(ErrorResponse("查询失败", exactReason))
  }
}


app.post('/addname', async (req, res) => {
  let hostname = req.hostname
  let shareLink = generateRandomString()
  let exactReason = {
    isShareAndInviteExist: false,

  }
  let date = dayjs().format('YYYY-MM-DD HH:mm:ss')
  // req.body现在包含了请求体中的数据
  const bodyData = req.body;
  // 检查 连接是否在分享表中
  let linkRecord = await executeQuery("select * from SharedLinks where Link=?", [bodyData.link]);
  console.log('xxxxxxxxxxxx', linkRecord)

  let UserRecord = await executeQuery("INSERT INTO Users (Username, InitialPoints,WalletAddress) VALUES (?,?,?)", [bodyData.address, 2000, bodyData.address]);
  console.log(UserRecord)

  if (linkRecord.length > 0) {
    // 增加一条记录表据
    let PointsRecords = await executeQuery("INSERT INTO PointsRecords (UserID, InvitedUserID, Timestamp) VALUES (?,?,?)", [linkRecord[0].UserID, UserRecord.insertId, date]);
    // 每当有新的积分记录时，更新用户的当前积分
    //UPDATE Users SET CurrentPoints = CurrentPoints + 2000 WHERE UserID = [InvitingUserID];
    await executeQuery("UPDATE PointsRecords SET CurrentPoints = CurrentPoints + 2000 WHERE UserID = ?", [UserRecord.insertId]);

  } else {
    // 不是通过分享点开的为 b 创建 分享连接 
    let SharedLinksRecord = await executeQuery("INSERT INTO SharedLinks (UserID, Link) VALUES (?, ?)", [UserRecord.insertId, bodyData.link]);
  }

  const sql = `SELECT
  u.WalletAddress,
  COUNT(DISTINCT pl.LinkID) AS InvitedCount,
  SUM(pr.Points) AS RewardBalance,
FROM
  Users u
LEFT JOIN SharedLinks pl ON u.UserID = pl.UserID
LEFT JOIN PointsRecords pr ON u.UserID = pr.InvitedUserID
WHERE
  u.UserID = (SELECT UserID FROM Users WHERE Username = ? LIMIT 1)
GROUP BY
  u.UserID`
  let result = await executeQuery(sql, [bodyData.address]);



  res.send(successResponse(result, "查询成功"))

});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});