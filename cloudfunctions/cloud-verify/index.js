const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'upload': {
      return upload(event)
    }
    case 'verifyList': {
      return verifyList(event)
    }
    default: {
      return
    }
  }
  
}

// 医生上传验证
async function upload(event) {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID
  return await db.collection('verify').doc(openid).set({
    data:{
      openid,
      images:event.images,
      documentID:event.documentID
    }
  })
}

// 管理员显示所有验证
async function verifyList(event) {
  return await db.collection('verify').get();
}