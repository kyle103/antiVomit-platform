// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  // console.log(event)
  switch (event.action) {
    case 'query': {
      return queryRoom(event)
    }
    default: {
      return
    }
  }
}
//查找chat-rooms
async function queryRoom(event) {
  console.log(event)
    var roomID;
    let res =  await db.collection('chat-rooms').where({patientID:event.patientID,doctorID:event.doctorID}).get();
    console.log("存在房间",res)
    // roomID = res.result.data[0]._id
    // return roomID;
    return res;
}

//添加chat-rooms
async function addRoom(event) {
  console.log(event)
    var roomID;
    console.log("不存在房间，需要创建")
    let tmp = await db.collection("chat-rooms").add({
      data: {
        doctorID:event.doctorID,
        patientID:event.patientID
      }
    })
    console.log("tmp",tmp)
    let res =  await chatrooms.where({patientID:event.patientID,doctorID:event.doctorID}).get();
    console.log("新房间",res.data)
    roomID = res.data._id
    return roomID;
}
