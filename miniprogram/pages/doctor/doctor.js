// pages/doctor/doctor.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    doctor_list:[
      
    ]
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
      complete:res=>{
        console.log("complete")
      }
    })
  },

  // 跳转详细对话框
  toDetail:function(e){
    let openid = e.currentTarget.dataset.index;
    console.log(openid)
    wx.navigateTo({
      url: '/pages/chatroom/chatroom?openid='+ openid,
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