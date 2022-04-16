// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articles:[],
    page:0,
    none:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'cloud-articles',
      data: {
        action: 'articleList',
        
      },
      success:res => {
        console.log('获取文章列表success',res)
        this.setData({
          articles:res.result.data
        })
        wx.hideLoading({
          success: (res) => {},
        })
      },
      fail:err => {
        wx.hideLoading({
          success: (res) => {},
        })
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

  search:function(event){
    wx.showLoading({
      title: '搜索中',
    })
    wx.cloud.callFunction({
      name: 'cloud-articles',
      data: {
        action: 'searchArticles',
        keywords:event.detail
      },
      success:res => {
        console.log('获取文章搜索结果success',res)
        if(res.result.length===0){
          this.setData({
            none:false
          })
        }
        this.setData({
          articles:res.result
        })
        wx.hideLoading({
          success: (res) => {},
        })
      },
      fail:err => {
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },

  cancelSearch:function(event){
    this.setData({
      none:true
    })
    this.onLoad()
  },

  // 跳转详细对话框
  toDetail:function(e){
    wx.navigateTo({
      url: '/pages/articles/articleDetail/articleDetail?url='+ e.currentTarget.dataset.index,
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