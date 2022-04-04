// pages/me/verify/verify.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bufferData:[],
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

  // 将图片上传至云存储空间
  uploadImg(){
    let that = this
    return new Promise((resolve,reject)=>{
      let filePaths = []
      let tmps = that.data.tempFilePaths
      tmps.forEach((tmp)=>{
        let timestamp = (new Date()).valueOf();
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: timestamp + '.png',
          // 指定要上传的文件的小程序临时文件路径
          filePath: tmp,
          // 成功回调
          success: res => {
            filePaths.push(res.fileID)
            if(filePaths.length===tmps.length){
              resolve(filePaths)
            }
          },
        })
      }) 
    })
  },
  
  submit:function(params) {
    let that = this
    wx.showLoading({
      title: '上传中',
      mask:true
    })
    // 将图片上传至云存储空间
    this.uploadImg().then(
      res=>{
        console.log('图片路径',res)
        let filePaths = res
        wx.cloud.callFunction({
          name: 'cloud-user',
          data: {
            action:'addDoctor',
            documentID:that.data.documentID,
            userInfo:app.globalData.userInfo,
            usertype:'doctor',
            images: filePaths
            // images: that.data.tempFilePaths
          },
          success: res => {
            wx.hideLoading();
            wx.showModal({
              title: '上传成功',
              content: '管理员将尽快审核',
              showCancel:false,
              success (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../pending/pending',
                  })
                }
              }
            })
          },
          fail: res => {
            wx.hideLoading();
          }
        })
      }
    )
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