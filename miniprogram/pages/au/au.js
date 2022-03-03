// pages/index1/index1.js
const app=getApp()
Page({
  data: {

  },
  getInfo(){

    wx.getUserProfile({
      desc: '获取用户信息',
      success(res){
        console.log(res)

        app.globalData.userInfo =res.userInfo
        wx.navigateBack({
          success(res){
            wx.showToast({
              title: '授权成功!',
            })
          }
        })
      }
    })
    
  }
})