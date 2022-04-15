// pages/consult/question/questionDetail/questionDetail.js
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
    this.setData({
      index:options.index
    })
    this.getDetail(options.index)
  },

  getDetail(index){
    let that = this
    wx.cloud.callFunction({
      name:'cloud-question',
      data:{
        action:'questionDetail',
        index
      },
      success:res=>{
        console.log(res)
        let item = res.result.data[0]
        let none = false
        if(item.answerNum==0){
          none = true
        }
        that.setData({
          item,
          none
        })
      }
    })
  },

  formSubmit(e){
    let that = this
    let {myanswer} = e.detail.value;
    if(myanswer.length===0){
      wx.showToast({
        title: '温馨提示：回答不能为空！',
        icon:'none'
      })
      return
    }
    
    let {_id}=that.data.item;
    wx.showLoading({
      title: '上传中',
      mask:true
    })
    wx.cloud.callFunction({
      name: 'cloud-question',
      data: {
        action:'answerQuestion',
        _id,
        myanswer
      },
      success: res => {
        wx.hideLoading();
        that.setData({
          myanswer:''
        })
        that.getDetail(that.data.index);
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