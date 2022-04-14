// pages/consult/question/addQuestion/addQuestion.js
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

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let {question} = e.detail.value
    if(question.length===0){
      wx.showToast({
        title: '温馨提示：问题不能为空！',
        icon:'none'
      })
      return
    }

    wx.showLoading({
      title: '上传中',
      mask:true
    })
    wx.cloud.callFunction({
      name: 'cloud-question',
      data: {
        action:'addQuestion',
        question
      },
      success: res => {
        wx.hideLoading();
        wx.navigateTo({
          url: '/pages/consult/question/question',
        })
      },
      fail: res => {
        wx.hideLoading();
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