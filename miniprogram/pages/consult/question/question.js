// pages/consult/question/question.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['公开咨询', '我的提问'],
    currentTab: 0,
  },

  navbarTap(e){
    let curid = e.currentTarget.dataset.idx
    let that = this
    this.setData({
      currentTab: curid
    })
    if(curid===0){
      this.onShow()
    }
    else{
      // 我的咨询
      wx.cloud.callFunction({
        name:'cloud-question',
        data:{
          action:'myQuestion',
        },
        success:res=>{
          console.log(res)
          that.setData({
            questions:res.result.data
          })
        }
      })
    }
  },

  addPosts(){
    wx.navigateTo({
      url: '/pages/consult/question/addQuestion/addQuestion',
    })
  },

  lookDetail(e){
    wx.navigateTo({
      url: '/pages/consult/question/questionDetail/questionDetail?index='+e.currentTarget.dataset.index,
    })
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
    let that = this
    wx.cloud.callFunction({
      name:'cloud-question',
      data:{
        action:'questionList',
      },
      success:res=>{
        console.log(res.result)
        that.setData({
          questions:res.result.data,
          currentTab:0
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