// pages/me/checkVerify/checkVerify.js
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
    this.getVerifyList().then(
      res=>{
        verifyList = res.verifyList
        tmpImgList = res.tmpImgList
        // 获取全体医生列表,筛选与认证人名字相同的医生
        wx.cloud.callFunction({
          name: 'cloud-doctor',
          success: res => {
            let doctorList = res.result.data
            for(let i in verifyList){
              doctorList.forEach(doctor=>{
                if(verifyList[i].documentID===doctor.documentID){
                  verifyList[i].doctor = doctor
                  break
                }
              }) 
            }
            wx.hideLoading({
              success: (res) => {},
            })
          },
          fail: res => {
            console.log("fail",res)
            wx.hideLoading({
              success: (res) => {},
            })
          },
        })
      }
    ).then(res=>{
      that.setData({
        verifyList:verifyList,
        tempFilePaths:tmpImgList
      },()=>{
        console.log(that.data)
      })
    })
  },

  // 获取认证列表
  getVerifyList(){
    let verifyList = []
    let tmpImgList = []
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name: 'cloud-verify',
        data: {
          action: 'verifyList',
        },
        success:res => {
          console.log('获取认证列表success',res)
          verifyList = res.result.data
          //所有图片
          verifyList.forEach(element => {
            element.images.forEach(url=>{
              tmpImgList.push(url)
            })
          });
          resolve({
            verifyList,
            tmpImgList
          })
        },
        fail:err => {
          reject(err)
        }
      })
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