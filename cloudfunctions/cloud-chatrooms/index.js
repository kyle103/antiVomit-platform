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
<<<<<<< HEAD
=======
    case 'patientRooms': {
      return patientRooms(event)
    }
    case 'doctorRooms': {
      return doctorRooms(event)
    }
>>>>>>> 1d945e35dfb7af60750f1a98c8da15f630ddd824
    case 'add': {
      return addRoom(event)
    }
    default: {
      return
    }
  }
}
//查找chat-rooms
async function queryRoom(event) {
  console.log(event)
  let res =  await db.collection('chat-rooms').where({patientID:event.patientID,doctorID:event.doctorID}).get();
  console.log("存在房间",res)
  return res;
}

<<<<<<< HEAD
=======
//用户是病人，查找自己咨询过的医生
async function patientRooms(event) {
  let res =  await db.collection('chat-rooms').where({patientID:event.patientID}).get();
  return res;
}

//用户是医生，查找咨询过自己的病人
async function doctorRooms(event) {
  let res =  await db.collection('chat-rooms').where({doctorID:event.doctorID}).get();
  return res;
}

>>>>>>> 1d945e35dfb7af60750f1a98c8da15f630ddd824
//添加chat-rooms
async function addRoom(event) {
  console.log(event)
    var roomID;
    let tmp = await db.collection("chat-rooms").add({
      data: {
        doctorID:event.doctorID,
        patientID:event.patientID
      }
    })
    // console.log("tmp",tmp)
    // let res =  await chatrooms.where({patientID:event.patientID,doctorID:event.doctorID}).get();
    // console.log("新房间",res.data)
    // roomID = res.data._id
    // return roomID;
    return tmp;
}
