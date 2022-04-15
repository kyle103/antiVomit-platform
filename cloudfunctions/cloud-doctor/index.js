const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'searchName': {
      return searchName(event)
    }
    case 'doctorDetail': {
      return doctorDetail(event)
    }
    case 'pendingDoctorList': {
      return pendingDoctorList(event)
    }
    case 'yesDoctorList': {
      return yesDoctorList(event)
    }
    case 'yesDoctor':{
      return yesDoctor(event)
    }
    default: {
      return
    }
  }
  
}

async function searchName(event) {
  let keywords = event.keywords || "";
  return await db.collection('doctor').where({
    name:db.RegExp({
      regexp:keywords,
      options:'i',
    }),
    openid:_.eq('')
  }).get();
}

async function doctorDetail(event) {
  return await db.collection('doctor').where({
    openid:event.doctorID
  }).get();
}

async function pendingDoctorList(event) {
  return await db.collection('doctor').where({
    openid:_.eq('')
  }).get();
}

async function yesDoctorList(event) {
  return await db.collection('doctor').where({
    openid:_.neq('')
  }).get();
}

async function yesDoctor(event) {
  return await db.collection('doctor').doc(event.documentID).update({
    data:{
      openid:event.openid
    }
  });
}