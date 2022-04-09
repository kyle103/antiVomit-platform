// 获取全局APP
const app = getApp();
// 转发
const db = wx.cloud.database();
// 获取命令行符号
const _ = db.command;
// 聊天侦听器
var chatWatcher = null
// 时间工具类
const timeutil = require('./timeutil');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // first: false,
    //输入框距离
    InputBottom: 0,
    roomID:"",
    userInfo: {},
    openid:app.globalData.openid,
    scrollId: '',
    systemInfo: {},
    //消息记录列表
    chatList: [],
    //标记触顶事件
    isTop: false,
    content: '',
    init:true
  },
  selectImg() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log(res)
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            var bufferData = res.data;
            wx.showLoading({
              title: '信息发送',
              mask:true
            })

            wx.cloud.callFunction({
              name: 'cloud-msg',
              data: {
                action:'addMsg',
                roomID:that.data.roomID,
                msgType: 'image',
                content: bufferData,
              },
              success: res => {
                
              },
              fail: res => {
                console.log(res)
              },
              complete: res => {
                this.setData({
                  content: ''
                })
                wx.hideLoading();
              }
            })
          }
        })
      }
    })
  },
  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },
  
  //发送消息
  async submit() {
    var that = this;
    wx.showLoading({
      title: '信息发送',
    })
    wx.cloud.callFunction({
      name: 'cloud-msg',
      data: {
        action:'addMsg',
        roomID:that.data.roomID,
        msgType: 'text',
        content: that.data.content,
      },
      success: res => {
        // console.log(res)
      },
      fail: res => {
        console.log(res)
      },
      complete: res => {
        this.setData({
          content: ''
        })
        wx.hideLoading();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let roomID = options.roomID;
    console.log("聊天室"+roomID)
    this.setData({
      roomID:roomID
    })

    //设置滚动高度
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res
        })
      }
    })

    //初始化消息历史
    this.setData({
      chatList: []
    }, () => {
      that.reqMsgHis();
    })
    //开启监听
    that.initWatcher()
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

  // 请求聊天记录
  reqMsgHis() {
    var that = this;
    wx.showLoading({
      title: '获取历史记录',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'cloud-msg',
      data: {
        action:'queryMsg',
        // step: that.data.chatList.length,
        roomID: that.data.roomID
      },
      success: res => {
        console.log(res)
        let tarr = res.result.data
        let newsLen = tarr.length
        if (newsLen == 0) {
          //查无数据
          setTimeout(function () {
            wx.showToast({
              title: '到顶了',
              icon: 'none'
            })
          }, 300)
        }
        tarr = tarr.reverse()
        that.setData({
          chatList: tarr.concat(that.data.chatList)
        }, () => {
          let len = that.data.chatList.length
          // if (that.data.isTop) {
          //   setTimeout(function () {
          //     that.setData({
          //       scrollId: 'msg-' + parseInt(newsLen)
          //     })
          //   }, 100)
          // } 
          // else {
            setTimeout(function () {
              that.setData({
                scrollId: 'msg-' + parseInt(newsLen-1)
              })
            }, 100)
          // }
        })
        console.log("历史消息列表",this.data.chatList)
        // 已读消息
        this.readMsg(tarr)
      },
      fail: res => {
        console.log(res)
      },
      complete: res => {
        if(!that.data.init){
          wx.hideLoading();
        }
      }
    })
  },

  readMsg(tarr){
    // 已读消息
    let readID = []
    for(let msg of tarr){
      if(msg.read===false&&msg.openid!=app.globalData.openid){
        readID.push(msg._id)
      }
    }
    console.log(readID)
    wx.cloud.callFunction({
      name:'cloud-msg',
      data:{
        action:'readMsg',
        id:readID
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  //初始化聊天监听器
  initWatcher() {
    var that = this
    this.chatWatcher = db.collection('chat-msgs')
    // 按 _createTime 降序
    .orderBy('_createTime', 'desc')
    // 取排序之后的前 1 个，会不会快一点？
    .limit(1)
    .where({
      roomID: this.data.roomID,
    })
    .watch({
      onChange: function(snapshot) {
        console.log('snapshot', snapshot)
        if(!that.data.init){
          // docs
          if (snapshot.docs.length != 0&&snapshot.docChanges[0].dataType!="update") {
            console.log(snapshot.docChanges)
            let tarr = []
            snapshot.docChanges.forEach(function (ele, index) {
              tarr.push(ele.doc)
            })
            that.setData({
              chatList: that.data.chatList.concat(tarr)
            }, () => {
              let len = that.data.chatList.length
              setTimeout(function () {
                that.setData({
                  scrollId: 'msg-' + parseInt(len - 1)
                })
              }, 100)
              console.log("更新后chatList,scrollId",that.data.chatList,that.data.scrollId)
              // 已读消息
              that.readMsg(tarr)
            })
          }
        }
        else{
          that.setData({
            init:false
          },()=>{
            wx.hideLoading();
          })
        }
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })

  },

  // 预览图片
  viewImage(e) {
    // console.log(e)
    let url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  },

  //触顶事件
  tapTop() {
    console.log('--触顶--')
    wx.showToast({
      title: '到顶了',
      icon: 'none'
    })
    // var that = this;
    // that.setData({
    //   isTop: true
    // }, 
    // () => {
    //   // this.reqMsgHis();
    // }
    // )
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    try {
      this.chatWatcher.close()
    } catch (error) {
      console.log('--消息监听器关闭失败--')
    }
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