const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'searchName': {
      return searchName(event)
    }
    case 'doctorList': {
      return doctorList(event)
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
    })
  }).get();
}

async function doctorList(event) {
  return await db.collection('doctor').get();
}
// const cloud = require('wx-server-sdk')
// cloud.init({
//   env: cloud.DYNAMIC_CURRENT_ENV
// })
// const db = cloud.database()
// const MAX_LIMIT = 100
// exports.main = async (event, context) => {
//   // 先取出集合记录总数
//   const countResult = await db.collection('doctor').count()
//   const total = countResult.total
//   // 计算需分几次取
//   const batchTimes = Math.ceil(total / 100)
//   // 承载所有读操作的 promise 的数组
//   const tasks = []
//   for (let i = 0; i < batchTimes; i++) {
//     const promise = db.collection('doctor').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
//     tasks.push(promise)
//   }
//   // 等待所有
//   return (await Promise.all(tasks)).reduce((acc, cur) => {
//     return {
//       data: acc.data.concat(cur.data),
//       errMsg: acc.errMsg,
//     }
//   })
// }