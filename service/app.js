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

app.post('/addname', async (req, res) => {
  let hostname = req.hostname
  let shareLink = hostname+':'+PORT+'/'+generateRandomString()
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
  let sharePerson = await executeQuery("select adress from ods_name where adress=?", [bodyData.shareCode]);
  console.log(bodyData.shareCode);
  console.log("sharePerson",sharePerson);
  exactReason.sharePerson = sharePerson.length>0
  // 假如被邀請人不在用户表 就添加到用户表
  console.log("invitedPerson",invitedPerson);
  if (invitedPerson.length == 0) {
    let addInvited = await executeQuery("insert into ods_name(time,adress,Registration_Amount,Invitation_Link) values(?,?,?,?)", [date, bodyData.address, 2000, bodyData.sharecode]);
    if (!addInvited) {
      res.send(ErrorResponse("添加用户失败"))
    }
  }

  // 分享人是否再用户表
  let isShareCode = sharePerson.length > 0;

  if (isShareCode) {
    // 查一下邀请表是否存在邀请人和被邀请人
    let isShareAndInviteExist = await executeQuery("select adress,beiyaoqingren from ods_invite where beiyaoqingren=?", [bodyData.address]);
    // 存在
    if (isShareAndInviteExist.length > 0) {
      exactReason.isShareAndInviteExist = true
      res.send(ErrorResponse("被邀请人已经存在",exactReason))
    } else {
      //不存在
      let addShareP = await executeQuery(
        "insert into ods_invite(time,adress,cookie,yqlj,jiangli,beiyaoqingren,yue) values(?,?,?,?,?,?,?)",
        [date, bodyData.shareCode, '', bodyData.shareLink, 2000, bodyData.address, 0]
      );

      if (addShareP) {
        exactReason.addShareP = true
        let rr = await selectData(bodyData.address)
        console.log('rr',rr);
        if(rr.length>0) {
          exactReason.shareLink = shareLink
          res.send(successResponse(Object.assign(rr[0],exactReason)))
        }else {
          res.send(ErrorResponse("查询失败",exactReason))
        }
      } else {
        exactReason.addShareP = false
        res.send(ErrorResponse("添加用户失败"))
      }
    }

  } else {
    let rr = await selectData(bodyData.address)
    console.log('rr',rr);
    if(rr.length>0) {
      exactReason.shareLink = shareLink
      res.send(successResponse(Object.assign(rr[0],exactReason)))
    }else {
      res.send(ErrorResponse("查询失败",exactReason))
    }
    

  }

});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});