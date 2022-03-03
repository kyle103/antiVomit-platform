// pages/doctor/doctor.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    doctor_list:[],
    doctorID:"",
    patientID:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    // 请求医生数据
    wx.cloud.callFunction({
      name: 'cloud-doctor',
      success: res => {
        console.log(res.result.data)
        this.setData({
          doctor_list:res.result.data
        })
      },
      fail: res => {
        console.log("fail")
        console.log(res)
      },
    })
  },

  // 跳转详细对话框
  toDetail:function(e){
    let hisopenid = e.currentTarget.dataset.index;
    console.log("对方id",hisopenid)
    //自己身份
    if(app.globalData.usertype === 'patient'){
      console.log('病人')
      this.setData({
        doctorID:hisopenid,
        patientID:app.globalData.openid
      })
    }
    
    //查找chat-rooms
    var roomID;
    wx.cloud.callFunction({
      name: 'cloud-chatrooms',
      data: {
        action: 'query',
        patientID:this.data.patientID,
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
              patientID:this.data.patientID,
              doctorID:this.data.doctorID
            },
            success:res => {
              console.log('添加聊天室success',res)
              roomID = res.result._id
              console.log('roomID',roomID)
              wx.navigateTo({
                url: '/pages/chatroom/chatroom?roomID='+ roomID,
              })
            }
          })
        }
        else{
          console.log("有聊天室")
          roomID = res.result.data[0]._id
          console.log('roomID',roomID)
          wx.navigateTo({
            url: '/pages/chatroom/chatroom?roomID='+ roomID,
          })
        }
      },
      fail:error => {
        console.log(error);
      }
    })
      
  },

  // 上拉刷新
  scrolltolower() {
    if (this.lock) {
      wx.showToast({
        title: '已经到底了！',
        icon: 'none'
      })
      return
    }
    this.data.page++
      wx.showLoading({
        title: '正在加载中...',
      })
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