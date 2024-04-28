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

async function invite_reward_result(address) {
  const sql = `SELECT
  u.WalletAddress,
  COUNT(DISTINCT pl.LinkID) AS InvitedCount,
  SUM(pr.Points) AS RewardBalance
FROM
  Users u
LEFT JOIN SharedLinks pl ON u.UserID = pl.UserID
LEFT JOIN PointsRecords pr ON u.UserID = pr.InvitedUserID
WHERE
  u.UserID = (SELECT UserID FROM Users WHERE Username = ? LIMIT 1)
GROUP BY
  u.UserID`

  if (!address) {
    return null;
  }

  const sql2 = `SELECT * from SharedLinks WHERE userID =(select userID from users where walletAddress = ?) `

  let r1 = await executeQuery(sql, [address]);
  let r2 = await executeQuery(sql2, [address]);
  console.log(r1[0], r2);
  return Object.assign(r1[0], r2[0])
}

app.get('/test', async (req, res) => {
  res.send("hello world")
})
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
  try {
    let linkRecord = await executeQuery("select * from SharedLinks where Link=?", [bodyData.link]);
    console.log('xxxxxxxxxxxx', linkRecord)
    // 先查一下用户表是否有该用户
    let userList = await executeQuery("select * from Users where WalletAddress=?", [bodyData.address]);
    console.log('[xxxxxxxxxxxxxx', userList)
    let UserRecord = {}
    // 如果用户表 没有用户插入用户表
    if (userList.length == 0) {
      UserRecord = await executeQuery("INSERT INTO Users (Username, InitialPoints,WalletAddress) VALUES (?,?,?)", [bodyData.address, 2000, bodyData.address]);
    }
    // 被邀请人的id
    let UserRecordID = userList.length > 0 ? userList[0].UserID : UserRecord.insertId
    if (linkRecord.length > 0) {
      // 增加一条记录表据  先判断是否已经存在
      let isExistPoint = await executeQuery("select * from PointsRecords where UserID=? and InvitedUserID=?", [linkRecord[0].UserID, UserRecordID])
      if (isExistPoint.length == 0) {
        await executeQuery("INSERT INTO PointsRecords (UserID, InvitedUserID, Timestamp) VALUES (?,?,?)", [linkRecord[0].UserID, UserRecordID, date]);
        // 每当有新的积分记录时，更新用户的当前积分
        //UPDATE Users SET CurrentPoints = CurrentPoints + 2000 WHERE UserID = [InvitingUserID];
        await executeQuery("UPDATE PointsRecords SET CurrentPoints = CurrentPoints + 2000 WHERE UserID = ?", [UserRecordID]);
      }

    }
    // 不是通过分享连接进入的 生成自己的分享连接
    // 如果已经添加 就不重复添加
    await executeQuery("select * from SharedLinks where UserID = ?", [UserRecordID]).then(async (res) => {
      if (res.length == 0) {
        await executeQuery("INSERT INTO SharedLinks (UserID, Link) VALUES (?, ?)", [UserRecordID, shareLink]);
      }
    });

    // await executeQuery("INSERT INTO SharedLinks (UserID, Link) VALUES (?, ?)", [UserRecordID, shareLink]);

    let result = await invite_reward_result(bodyData.address)

    res.send(successResponse(result, "查询成功"))


  } catch (error) {
    res.send(ErrorResponse("查询失败", error))
  }

});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});