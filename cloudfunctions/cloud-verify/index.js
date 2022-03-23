const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID
  return await db.collection('verify').doc(openid).set({
    data:{
      openid,
      images:event.images
    }
  })
}