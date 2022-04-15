// pages/doctor/patient/patient.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.myConsult()
  },

  // 是否有新消息
  newMsg(roomids){
    let newMsgs = []
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name:'cloud-msg',
        data:{
          action:'queryUnreadMsg',
          rooms:roomids,
          openid:app.globalData.openid
        },
        success:res=>{
          let tmp = res.result.data
          tmp.forEach((msg)=>{
            newMsgs.push(msg.openid)
          })
          resolve(newMsgs)
        },
        fail:err=>{
          reject(err)
        }
      })
    })
  },

  // 我的患者咨询
  myConsult(){
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'cloud-chatrooms',
      data: {
        action: 'doctorRooms',
        doctorID:app.globalData.openid,
      },
      success: res => {
        console.log('查找记录success',res)
        let mypatients = []
        let patientids = []
        if(res.result.data.length===0){
          console.log("没有记录")
        }
        else{
          console.log('房间记录',res.result.data)
          let rooms = res.result.data
          let roomids = []
          rooms.forEach(element => {
            roomids.push(element._id)
          });
          // 是否有新消息
          that.newMsg(roomids).then(
            res=>{
              console.log('newMsgs',res)
              let newMsgs = res
              // 请求病人信息
              for(let r of rooms){
                patientids.push(r.patientID)
              }
              console.log('我的病人id',patientids)
              wx.cloud.callFunction({
                name:'cloud-user',
                data:{
                  action:'myPatients',
                  openids:patientids
                },
                success:res=>{
                  console.log(res.result.data)
                  mypatients = res.result.data
                  for(let patient of mypatients){
                    if(newMsgs.includes(patient.openid)){
                      patient.newMsg = true
                    }
                    else{
                      patient.newMsg = false
                    }
                  }
                  console.log('我的病人',mypatients)
                  that.setData({
                    mypatients
                  })
                },
                fail:err=>{
                  console.log('fail',err)
                }
              })
            },
            err=>{

            }
          ) 
        }
      },
      fail:error => {
        console.log(error);   
      },
      complete:res => {
        wx.hideLoading()
      }
    })
  },

  // 跳转详细对话框
  toDetail:function(e){
    //查找chat-rooms
    let roomID;
    let hisopenid = e.currentTarget.dataset.index;
    wx.cloud.callFunction({
      name: 'cloud-chatrooms',
      data: {
        action: 'query',
        patientID:hisopenid,
        doctorID:app.globalData.openid
      },
      success: res => {
        console.log('查找聊天室success',res)
        if(res.result.data.length===0){
          console.log("无聊天室，需要创建")
          wx.cloud.callFunction({
            name: 'cloud-chatrooms',
            data: {
              action: 'add',
              patientID:hisopenid,
              doctorID:app.globalData.openid
            },
            success:res => {
              console.log('添加聊天室success',res)
              roomID = res.result._id
              console.log('roomID',roomID)
              wx.navigateTo({
                url: '/pages/consult/chatroom/chatroom?roomID='+ roomID,
              })
            }
          })
        }
        else{
          console.log("有聊天室")
          roomID = res.result.data[0]._id
          console.log('roomID',roomID)
          wx.navigateTo({
            url: '/pages/consult/chatroom/chatroom?roomID='+ roomID,
          })
        }
      },
      fail:error => {
        console.log(error);
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.myConsult()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})