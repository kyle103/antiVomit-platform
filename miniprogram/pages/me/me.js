// pages/person/index.js
const app = getApp()

Page({
  data:{
    userInfo: {}, 
    usertype:''
  },

  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用户登录',
      success: res => {
        let userInfo = res.userInfo
        let that=this
        wx.navigateTo({
          url: './information/index',
        })
        app.globalData.userInfo = userInfo
        this.userRegister(userInfo).then(r => {
          console.log(r)
          that.setData({
            login: true,
            userInfo:userInfo
          })
          
        })
      }
    })
  },

  userRegister(userInfo) {
    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'cloud-user',
        data: {
          action:'addUser',
          userInfo: userInfo
        },
        success: res => {
          resolve(res)
        },
        fail: res => {
          reject(res)
        }
      })
    })

  },

  //身份校验
  userAuth() {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'cloud-user',
      data:{
        action:'auth'
      },
      success: res => {
        if(res.result.errCode == -1) {
          console.log('--未登录--')
          wx.hideLoading() 
          wx.redirectTo({
            url: '/pages/me/type/type',
          })
        } 
        else if(res.result.result.status==='registered'){
          console.log('--已登录--',res)
          // app.globalData.openid = res.result.result.openid;
          app.globalData.usertype = res.result.result.usertype;
          console.log("globalData",app.globalData)
          this.setData({
            login: true,
            userInfo:res.result.result.userInfo,
            usertype:res.result.result.usertype
          })
          wx.hideLoading() 
        }
        else if(res.result.result.status==='pending'){
          wx.hideLoading() 
          wx.redirectTo({
            url: '/pages/me/pending/pending',
          })
        }
        else if(res.result.result.status==='rejected'){
          wx.hideLoading() 
          wx.redirectTo({
            url: '/pages/me/type/type?status=rejected',
          })
        }
      },
      fail: res => {
        wx.hideLoading() 
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //身份校验
    this.userAuth();
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