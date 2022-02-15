// 获取全局APP
const app = getApp();
// 转发
const db = wx.cloud.database();
// 聊天侦听器
var chatWatcher = null
// 获取计时器函数
Page({
  /**
   * 页面的初始数据
   */
  data: {
    login: false,
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
    groups: [{
      text: '点歌',
      value: 1
    }],
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
              name: 'cloud-msg-push',
              data: {
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
  showAction() {
    wx.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success(res) {
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  //发送消息
  async submit() {
    var that = this;
    wx.showLoading({
      title: '信息发送',
    })
    wx.cloud.callFunction({
      name: 'cloud-msg-push',
      data: {
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
    var that = this;
    //初始化消息历史
    this.setData({
      chatList: []
    }, () => {
      // that.reqMsgHis();
    })

    //开启监听
    that.initWatcher()
  },

  // 请求聊天记录
  reqMsgHis() {
    var that = this;
    wx.showLoading({
      title: '获取历史记录',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'cloud-msg-his',
      data: {
        step: that.data.chatList.length,
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
          if (that.data.isTop) {
            setTimeout(function () {
              that.setData({
                scrollId: 'msg-' + parseInt(newsLen)
              })
            }, 100)
          } else {
            setTimeout(function () {
              that.setData({
                scrollId: 'msg-' + parseInt(len - 1)
              })
            }, 100)
          }

        })
        console.log("消息列表",this.data.chatList)
      },
      fail: res => {
        console.log(res)
      },
      complete: res => {
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    try {
      this.messageWatcher.close()
    } catch (error) {
      console.log('--消息监听器关闭失败--')
    }
  },

  //初始化聊天监听器
  initWatcher() {
    var that = this
    chatWatcher = db.collection('chat-msgs')
    .orderBy('_createTime','asc')
    // .orderBy('_createTime','desc')
    .limit(10)
    .where({
      roomID: this.data.roomID
    })
    .watch({
      onChange: function(snapshot) {
        console.log('snapshot', snapshot)
        if (snapshot.docChanges.length != 0) {
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
    var that = this;
    that.setData({
      isTop: true
    }, () => {
      this.reqMsgHis();
    })
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