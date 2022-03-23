const cloud = require('wx-server-sdk')
const crypto = require('crypto');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command;
// 时间工具类
const timeutil = require('./timeutil');
// 用户信息表名称
const USER = 'users';
// 消息记录表
const MSG = 'chat-msgs';
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'queryMsg': {
      return queryMsg(event)
    }
    case 'addMsg': {
      return addMsg(event)
    }
    default: {
      return
    }
  }
  
}
//查找聊天记录
async function queryMsg(event) {
  // 获取房间号
  let roomID = event.roomID || "";
  let step = event.step  || 0;
  let limit = event.limit || 10;
  return await db.collection(MSG).where({roomID:roomID}).skip(step).limit(limit).orderBy('_createTime','desc').get();
}

//添加聊天记录
async function addMsg(event) {
  const wxContext = cloud.getWXContext()
  // 获取用户唯一身份识别ID
  let openid = wxContext.OPENID || event.openid;
  let _userInfo_ = await db.collection(USER).doc(openid).get();
  // 获取用户信息
  let userInfo = _userInfo_.data.userInfo;
  // 获取消息类型
  let msgType = event.msgType || 'text';
  // 获取消息主体内容
  let content = event.content;
  let roomID = event.roomID;

  // 根据消息类型 -- 进行不同逻辑处理
  switch (msgType) {
    case 'text': {
      // 写入数据
      return await db.collection(MSG).add({
        data: {
          openid,
          msgType,
          content,
          userInfo,
          roomID,
          // _createTime: Date()
          _createTime: timeutil.TimeCode()
          // _createTime: TimeCode()
        }
      })
      break
    }
    case 'image': {
      let content = event.content;
      //将图片传入云存储
      const hash = crypto.createHash('md5');
      hash.update(content, 'utf8');
      const md5 = hash.digest('hex');
      console.log('--文件唯一MD5编码--')
      console.log(md5);
      let upData = await cloud.uploadFile({
        cloudPath: 'cloud-chat/'+md5+'.png',
        fileContent: Buffer.from(content,'base64')
      })
      console.log(upData)
      let fileID = upData.fileID;
      // 写入数据
      return await db.collection(MSG).add({
        data: {
          openid,
          msgType,
          content:fileID,
          userInfo,
          roomID,
          _createTime: timeutil.TimeCode()
        }
      })
      break
    }
  }
}