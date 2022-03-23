// pages/me/verify/verify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // bufferData:'',
    tempFilePaths: [],
    name:'',
    none:true,
    visible:true,
    doctors:[],
    documentID:'',
    selected:-1
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

  loadpic: function () {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tempFilePaths: that.data.tempFilePaths.concat(res.tempFilePaths),
        })
      }
    });

  },

  previewImg: function (e) {
    var that = this;
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      //当前显示图片
      current: this.data.tempFilePaths[index],
      //所有图片
      urls: this.data.tempFilePaths
    })
  },


  deleteImg: function (e) {
    var that = this;
    var imgs = that.data.tempFilePaths;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      tempFilePaths: imgs,
    });
  },


  // selectImg() {
  //   var that = this;
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: res => {
  //       console.log(res)
  //       wx.getFileSystemManager().readFile({
  //         filePath: res.tempFilePaths[0], //选择图片返回的相对路径
  //         encoding: 'base64', //编码格式
  //         success: res => { //成功的回调
  //           var bufferData = res.data;
  //           that.setData({
  //             bufferData:bufferData
  //           })
  //         }
  //       })
  //     }
  //   })
  // },

  nameInput(e){
    this.setData({
      name:e.detail.value
    })
  },

  search:function(event){
    this.setData({
      none:true,
    })
    wx.showLoading({
      title: '搜索中',
    })
    wx.cloud.callFunction({
      name: 'cloud-doctor',
      data: {
        action: 'searchName',
        keywords:event.detail
      },
      success:res => {
        console.log('获取医生搜索结果success',res)
        if(res.result.data.length===0){
          this.setData({
            none:false
          })
        }
        this.setData({
          doctors:res.result.data,
          visible:false
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
      none:true,
      visible:true
    })
  },

  select(e){
    let documentID = e.currentTarget.dataset.documentid
    this.setData({
      documentID:documentID,
      selected:Number(e.currentTarget.dataset.index)
    })
  },

  submit:function(params) {
    let that = this
    console.log(this.data.name)
    wx.showLoading({
      title: '上传中',
      mask:true
    })

    wx.cloud.callFunction({
      name: 'cloud-verify',
      data: {
        action:'upload',
        // name:that.data.name,
        documentID:that.data.documentID,
        openid:wx.getStorageSync('openid'),
        images: that.data.tempFilePaths
      },
      success: res => {
        wx.hideLoading();
        wx.showToast({
          title: '上传成功！',
        })
      },
      fail: res => {
        wx.hideLoading();
        console.log(res)
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