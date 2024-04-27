const express = require('express');
const bodyParser = require('body-parser');
const dayjs = require('dayjs')
const app = express();
const cors = require('cors');
const {  connection, executeQuery, selectData } = require("./sql")
const {generateRandomString}  =require("./config/utils")
const { Response, successResponse, ErrorResponse } = require('./config/response');
const PORT = process.env.PORT || 3000;
// 使用body-parser中间件解析JSON和URL编码的请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 允许所有域名访问
app.use(cors());

// 或者，你可以指定允许的域名：
app.use((err,req, res, next) => {
  if(err) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Allow', 'GET, HEAD, OPTIONS, POST');
  next();
});

async function invite_reward_result(address,exactReason,res,message) {
  let rr = await selectData(address)
  if(rr.length>0) {
    res.send(successResponse(Object.assign(rr[0],exactReason),message?message:"查询成功"))
  }else {
    res.send(ErrorResponse("查询失败",exactReason))
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
  // 检查 被邀请人是否在用户表 
  let invitedPerson = await executeQuery("select adress from ods_name where adress=?", [bodyData.address]);
  exactReason.invitedPerson = invitedPerson.length>0
  // 邀请人是否再用户表
  let sharePerson = await executeQuery("select adress from ods_name where Invitation_Link=?", [bodyData.shareCode]);
  console.log(bodyData.shareCode);
  console.log("sharePerson",sharePerson);
  exactReason.sharePerson = sharePerson.length>0
  // 假如被邀請人不在用户表 就添加到用户表
  console.log("invitedPerson",invitedPerson);
  if (invitedPerson.length == 0) {
    let addInvited = await executeQuery("insert into ods_name(time,adress,Registration_Amount,Invitation_Link) values(?,?,?,?)", [date, bodyData.address, 2000, shareLink]);
    if (!addInvited) {
      res.send(ErrorResponse("添加用户失败"))
    }
  }

  // 分享人是否再用户表
  let isShareCode = sharePerson.length > 0;

  if (isShareCode) {
    // 查看是否被邀请人在表里，如果在 就 说明曾经被邀请过
    let isShareAndInviteExist = await executeQuery("select adress,beiyaoqingren from ods_invite where beiyaoqingren=?", [bodyData.address]);
    // 存在
    if (isShareAndInviteExist.length > 0) {
      exactReason.isShareAndInviteExist = true
      invite_reward_result(bodyData.address,exactReason,res,"被邀请人存在")

    } else {
      //不存在
      // adress = 分享人的address 
      //beiyaoqingren = 被邀请人的address

      let addShareP = await executeQuery(
        "insert into ods_invite(time,adress,cookie,yqlj,jiangli,beiyaoqingren,yue) values(?,?,?,?,?,?,?)",
        [date, sharePerson[0].adress, '', bodyData.shareCode, 2000, bodyData.address, 0]
      );

      if (addShareP) {
        exactReason.addShareP = true
        invite_reward_result(bodyData.address,exactReason,res)
      } else {
        exactReason.addShareP = false
        res.send(ErrorResponse("添加用户失败"))
      }
    }

  } else {

    invite_reward_result(bodyData.address,exactReason,res)

  }

});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});