const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    sex:'',
    age:'',
    illness:'',
    medicine:'',
    medicineList:[]
  },

  medicineBlur(e){
    console.log(e.detail.value)
    this.setData({
      medicine:e.detail.value
    })
  },

  bindStartDateChange: function(e) {
    this.setData({
      startdate: e.detail.value
    })
  },
  bindEndDateChange: function(e) {
    this.setData({
      enddate: e.detail.value,
    })
  },
  medicineOK(){
    let tmp = {
      medicine:this.data.medicine,
      startdate:this.data.startdate,
      enddate:this.data.enddate
    }
    let medicineList=this.data.medicineList
    medicineList.push(tmp)
    this.setData({
      startdate:'',
      enddate: '',
      medicine:'',
      medicineList
    })
  },
  medicineEdit(e){
    let id = e.currentTarget.dataset.index
    let medicineList=this.data.medicineList
    let startdate = medicineList[id].startdate
    let enddate = medicineList[id].enddate
    let medicine = medicineList[id].medicine
    medicineList.splice(id,1)
    this.setData({
      startdate,
      enddate,
      medicine,
      medicineList
    })
  },
  medicineClose(e){
    let id = e.currentTarget.dataset.index
    let medicineList=this.data.medicineList
    medicineList.splice(id,1)
    this.setData({
      medicineList
    })
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let values = Object.values(e.detail.value)
    for(let v of values){
      if(v.length===0){
        wx.showToast({
          title: '温馨提示：健康档案项不能为空！',
          icon:'none'
        })
        return
      }
    }
    let {medicineList} = this.data
    let {name,sex,age,illness,hospital} = e.detail.value
    let patientInfo = {
      name,
      sex,
      age,
      illness,
      hospital,
      medicineList
    }
    wx.showLoading({
      title: '上传中',
      mask:true
    })
    wx.cloud.callFunction({
      name: 'cloud-user',
      data: {
        action:'addPatient',
        userInfo:app.globalData.userInfo,
        patientInfo:patientInfo
      },
      success: res => {
        wx.hideLoading();
        wx.switchTab({
          url: '/pages/me/me',
        })
      },
      fail: res => {
        wx.hideLoading();
      }
    })

  },


  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this
    // 获取初值
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'cloud-user',
      data:{
        action:'auth'
      },
      success: res => {
        let {name,sex,age,illness,hospital,medicineList} = res.result.result.patientInfo
        that.setData({
          name,
          sex,
          age,
          illness,
          hospital,
          medicineList  
        })
        wx.hideLoading() 
      },
      fail: res => {
        wx.hideLoading() 
        console.log(res)
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