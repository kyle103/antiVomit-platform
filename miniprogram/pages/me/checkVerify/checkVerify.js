// pages/me/checkVerify/checkVerify.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verifyList:[],
    none:true,
    tempFilePaths: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let verifyList = []
    let tmpImgList = []
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'cloud-user',
      data: {
        action:'verifyList',
      },
      success: res => {
        console.log(res)
        verifyList = res.result.data
        //所有图片
        verifyList.forEach(element => {
          element.images.forEach(url=>{
            tmpImgList.push(url)
          })
        });
        //  获取全体医生列表,筛选与认证人名字相同的医生
        wx.cloud.callFunction({
          name: 'cloud-doctor',
          data:{
            action:'pendingDoctorList'
          },
          success: res => {
            console.log(res)
            let doctorList = res.result.data
            for(let i=0;i<verifyList.length;i++){
              for(let doctor of doctorList){
                if(verifyList[i].documentID===doctor._id){
                  verifyList[i].doctor = doctor
                  break
                }
              }
            }
            that.setData({
              verifyList:verifyList,
              tempFilePaths:tmpImgList
            },()=>{
              console.log(that.data)
            })
            wx.hideLoading()
          },
          fail: res => {
            console.log("请求医生fail",res)
            wx.hideLoading()
          },
        })
      },
      fail: res => {
        wx.hideLoading();
        console.log(res)
      }
    })
  },

  yes(e){
    let that = this
    // 用户status
    wx.cloud.callFunction({
      name: 'cloud-user',
      data: {
        action:'yesDoctor',
        openid:e.currentTarget.dataset.index
      },
      success: res => {
        console.log(res)
      },
      fail: res => {
        console.log(res)
      }
    })
    // doctor openid绑定
    wx.cloud.callFunction({
      name: 'cloud-doctor',
      data: {
        action:'yesDoctor',
        openid:e.currentTarget.dataset.index,
        documentID:e.currentTarget.dataset.documentid
      },
      success: res => {
        console.log(res)
      },
      fail: res => {
        console.log(res)
      }
    })
    // 刷新页面
    let verifyList = that.data.verifyList
    for(let i=0;i<verifyList.length;i++){
      if(verifyList[i].openid===e.currentTarget.dataset.index){
        verifyList.splice(i,1)
        break
      }
    }
    that.setData({
      verifyList
    })
  },
  no(e){
    // 用户status
    wx.cloud.callFunction({
      name: 'cloud-user',
      data: {
        action:'noDoctor',
        openid:e.currentTarget.dataset.index
      },
      success: res => {
        console.log(res)
      },
      fail: res => {
        console.log(res)
      }
    })
    // 刷新页面
    let verifyList = this.data.verifyList
    for(let i=0;i<verifyList.length;i++){
      if(verifyList[i].openid===e.currentTarget.dataset.index){
        verifyList.splice(i,1)
        break
      }
    }
    this.setData({
      verifyList
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

  previewImg: function (e) {
    var that = this;
    console.log(e)
    //获取当前图片的下标
    var url = e.currentTarget.dataset.url;
    wx.previewImage({
      //当前显示图片
      current: url,
      //所有图片
      urls: this.data.tempFilePaths
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