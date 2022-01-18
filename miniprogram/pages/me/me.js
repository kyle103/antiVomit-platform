// pages/person/index.js
const app = getApp()

Page({
  data:{
    userInfo: {},
    login: false,
    state:false,
  },

  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用户登录',
      success: res => {
        let userInfo = res.userInfo
        let that=this
        wx.showLoading({
          title: '获取用户信息',
        })
        this.userRegister(userInfo).then(r => {
          console.log(r)
          wx.hideLoading();
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

  userAuth() {
    //身份校验
    wx.cloud.callFunction({
      name: 'auth',
      success: res => {
        console.log(res)
        if (res.result.errCode == -1) {
          console.log('--未登录--')
          this.setData({
            login: false
          })
        } else {
          console.log('--已登录--')
          this.setData({
            login: true,
            userInfo:res.result.result.userInfo
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    // api.getRequestData('healthy/get_healthy_record/isfinish',{,'GET',false).then((res)=>{
    //   console.log("state",res.data)
    //   this.setData({
    //     state:res.data.data
    //   })
    // })
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