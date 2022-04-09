const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command;
const USER = 'users';
// 云函数入口函数
exports.main = async (event, context) => {
<<<<<<< HEAD
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID
  return await db.collection(USER).doc(openid).set({
    data:{
      openid,
      userInfo:event.userInfo
    }
  })
}
=======
  switch (event.action) {
    case 'auth': {
      return auth(event)
    }
    case 'addDoctor': {
      return addDoctor(event)
    }
    case 'addPatient': {
      return addPatient(event)
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
    case 'myPatients': {
      return myPatients(event)
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

async function addPatient(event) {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID;
  return await db.collection(USER).doc(openid).set({
    data:{
      openid,
      userInfo:event.userInfo,
      usertype:'patient',
      status:'registered',
      patientInfo:event.patientInfo
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
<<<<<<< HEAD
>>>>>>> 1d945e35dfb7af60750f1a98c8da15f630ddd824
=======

async function myPatients(event) {
  return await db.collection(USER).where({
    openid:_.in(event.openids)
  }).get()
}
>>>>>>> 91bc431b9826f5efcdf05ed95a00ec4b7bd6b175
