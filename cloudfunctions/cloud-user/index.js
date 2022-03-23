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
    case 'addUser': {
      return addUser(event)
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

//新增用户
async function addUser(event) {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID
  let usertype = event.usertype || 'patient'
  return await db.collection(USER).doc(openid).set({
    data:{
      openid,
      userInfo:event.userInfo,
      usertype:usertype
    }
  })
}
