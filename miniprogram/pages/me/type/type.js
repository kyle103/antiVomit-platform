// pages/me/type/type.js
const app = getApp()
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

  getUserProfile(e) {
    return new Promise((resolve,reject)=>{
      
    }) 
  },


  toDoctor:function(params) {
    wx.getUserProfile({
      desc: '用户登录',
      success: res => {
        let userInfo = res.userInfo
        app.globalData.userInfo = userInfo
        wx.navigateTo({
          url: '../verify/verify',
        })
      }
    })
  },

  toPatient:function(params) {
    wx.getUserProfile({
      desc: '用户登录',
      success: res => {
        let userInfo = res.userInfo
        app.globalData.userInfo = userInfo
        wx.navigateTo({
          url: '../information/information',
        })
      }
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