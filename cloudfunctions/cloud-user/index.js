const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command;
const USER = 'users';
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'auth': {
      return auth(event)
    }
    case 'addDoctor': {
      return addDoctor(event)
    }
    case 'verifyList': {
      return verifyList(event)
    }
    case 'yesDoctor': {
      return yesDoctor(event)
    }
    case 'noDoctor': {
      return noDoctor(event)
    }
    default: {
      return
    }
  }
  
}
// 查询用户
async function auth(event) {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID;
  try {
    let res =  await db.collection(USER).doc(openid).get();
    return {
      result:res.data
    }
  } catch (error) {
    return {
      errMsg:'cloud.auth:false',
      errCode:-1
    }
  }
}

async function addDoctor(event) {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID;
  return await db.collection(USER).doc(openid).set({
    data:{
      openid,
      userInfo:event.userInfo,
      usertype:event.usertype,
      status:'pending',
      documentID:event.documentID,
      images:event.images
    }
  })
}

async function verifyList(event) {
  return await db.collection(USER).where({
    status:'pending'
  }).get();
}

async function yesDoctor(event) {
  let openid = event.openid
  return await db.collection(USER).doc(openid).update({
    data:{
      status:'registered',
    }
  })
}

async function noDoctor(event) {
  let openid = event.openid
  return await db.collection(USER).doc(openid).update({
    data:{
      status:'rejected',
    }
  })
}
