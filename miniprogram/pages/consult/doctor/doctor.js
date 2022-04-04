// pages/doctor/doctor.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    doctor_list:[],
    mydoctors:[],
    mypatients:[],
    doctorID:"",
    patientID:"",
    navbar: ['医生列表', '我的咨询'],
    currentTab: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求医生数据
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'cloud-doctor',
      data:{
        action:'yesDoctorList'
      },
      success: res => {
        console.log('已注册医生',res.result.data)
        this.setData({
          doctor_list:res.result.data,
          usertype:app.globalData.usertype
        })
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

  // 我的咨询显示聊天最后一条消息，废案
  queryMsg:function(){
    let that = this
    return new Promise((resolve,reject)=>{
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name: 'cloud-chatrooms',
        data: {
          action: 'patientRooms',
          patientID:app.globalData.openid,
        },
        success: res => {
          console.log('查找记录success',res)
          if(res.result.data.length===0){
            console.log("没有记录")
          }
          else{
            console.log('房间记录',res.result.data)
            let rooms = res.result.data
            let msgs = []
            for(let i=0;i<rooms.length;i++){
              let content = ''
              // 最后一条消息
              wx.cloud.callFunction({
                name: 'cloud-msg-his',
                data: {
                  limit: 1,
                  roomID: rooms[i]._id
                },
                success: res => {
                  if(res.result.data[0].msgType==='image'){
                    content = '[图片]'
                  }
                  else{
                    content = res.result.data[0].content
                  }
                  console.log(content)
                  // 医生信息
                  let curDoctor = {}
                  for(let doctor of that.data.doctor_list){
                    if(doctor.openid===rooms[i].doctorID){
                      curDoctor = doctor
                      break;
                    }
                  }
                  msgs.push({
                    msg:content,
                    doctor:curDoctor,
                    roomID:rooms[i]._id
                  })
                  if(i===rooms.length-1){
                    console.log(msgs)
                    resolve(msgs)
                  }
                },
                fail: res => {
                  console.log(res)
                }
              })
            }
          }
        },
        fail:error => {
          console.log(error);   
        },
        complete:res => {
          wx.hideLoading()
        }
      })
    })
  },

  //切换bar
  navbarTap: function (e) {
    let curid = e.currentTarget.dataset.idx
    this.setData({
      currentTab: curid
    })
    if(curid===0){
      this.onShow()
    }
    else{
      // 我的咨询
      this.myConsult()
    }
  },

  // 我的咨询
  myConsult(){
    let that = this
    // 自己身份
    if(app.globalData.usertype === 'patient'){
      console.log('病人')
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name: 'cloud-chatrooms',
        data: {
          action: 'patientRooms',
          patientID:app.globalData.openid,
        },
        success: res => {
          console.log('查找记录success',res)
          let mydoctors = []
          if(res.result.data.length===0){
            console.log("没有记录")
          }
          else{
            console.log('房间记录',res.result.data)
            let rooms = res.result.data
            let roomids = []
            rooms.forEach(element => {
              roomids.push(element._id)
            });
            // 是否有新消息
            that.newMsg(roomids).then(
              res=>{
                console.log('newMsgs',res)
                let newMsgs = res
                for(let i=0;i<rooms.length;i++){
                  // 医生信息
                  let curDoctor = {}
                  for(let doctor of that.data.doctor_list){
                    if(doctor.openid===rooms[i].doctorID){
                      curDoctor = doctor
                      break;
                    }
                  }
                  if(newMsgs.includes(curDoctor.openid)){
                    curDoctor.newMsg = true
                  }
                  else{
                    curDoctor.newMsg = false
                  }
                  mydoctors.push(curDoctor)
                }
                console.log('mydoctors',mydoctors)
                that.setData({
                  mydoctors:mydoctors
                })
              },
              err=>{

              }
            )
          }
        },
        fail:error => {
          console.log(error);   
        },
        complete:res => {
          wx.hideLoading()
        }
      })
    }
  },

  // 是否有新消息
  newMsg(roomids){
    let newMsgs = []
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name:'cloud-msg',
        data:{
          action:'queryUnreadMsg',
          rooms:roomids,
          openid:app.globalData.openid
        },
        success:res=>{
          let tmp = res.result.data
          tmp.forEach((msg)=>{
            newMsgs.push(msg.openid)
          })
          resolve(newMsgs)
        },
        fail:err=>{
          reject(err)
        }
      })
    })
  },

  // 跳转详细对话框
  toDetail:function(e){
    let that = this
    let hisopenid = e.currentTarget.dataset.index;
    console.log("对方id",hisopenid)
    //自己身份
    if(app.globalData.usertype === 'patient'){
      console.log('病人')
      this.setData({
        doctorID:hisopenid,
        patientID:app.globalData.openid
      },()=>{
        wx.navigateTo({
          url: '/pages/consult/doctorDetail/doctorDetail?doctorID='+ hisopenid,
        })
      })
    }
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