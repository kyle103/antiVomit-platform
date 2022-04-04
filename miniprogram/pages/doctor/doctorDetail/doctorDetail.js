// pages/doctor/doctorDetail/doctorDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  submit(){
    //查找chat-rooms
    var roomID;
    wx.cloud.callFunction({
      name: 'cloud-chatrooms',
      data: {
        action: 'query',
        patientID:app.globalData.openid,
        doctorID:this.data.doctorID
      },
      success: res => {
        console.log('查找聊天室success',res)
        if(res.result.data.length===0){
          console.log("无聊天室，需要创建")
          wx.cloud.callFunction({
            name: 'cloud-chatrooms',
            data: {
              action: 'add',
              patientID:app.globalData.openid,
              doctorID:this.data.doctorID
            },
            success:res => {
              console.log('添加聊天室success',res)
              roomID = res.result._id
              console.log('roomID',roomID)
              wx.navigateTo({
                url: '/pages/doctor/chatroom/chatroom?roomID='+ roomID,
              })
            }
          })
        }
        else{
          console.log("有聊天室")
          roomID = res.result.data[0]._id
          console.log('roomID',roomID)
          wx.navigateTo({
            url: '/pages/doctor/chatroom/chatroom?roomID='+ roomID,
          })
        }
      },
      fail:error => {
        console.log(error);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.doctorID)
    wx.cloud.callFunction({
      name: 'cloud-doctor',
      data:{
        action:'doctorDetail',
        doctorID:options.doctorID
      },
      success: res => {
        console.log(res.result.data[0])
        let {department,
          excel,
          hospital,
          name,
          title,
          description,
          photo} = res.result.data[0]
        this.setData({
          department,
          excel,
          hospital,
          name,
          doctorID:options.doctorID,
          title,
          description,
          photo
        })
        wx.hideLoading()
      },
      fail: res => {
        console.log("fail",res)
        wx.hideLoading()
      },
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