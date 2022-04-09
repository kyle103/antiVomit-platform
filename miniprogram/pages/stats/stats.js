const util=require("../../util/util")
const app=getApp()

import MpProgress from '../../components/mp-progress/progress.min';
Page({
  onReady(){
    const mprogress = new MpProgress({
      target: this,
      percent:100,
      canvasId: 'progress',
      canvasSize: {width: 300, height: 300},//400
      barStyle: [{width: 20,lineCap:'round',fillStyle:'#56B37F', fillStyle: '#f7f7f7'}, {width: 20, animate:true, fillStyle: [{position: 0, color: '#56B37F'}, {position: 1, color: '#c0e674'}]}],
    });
    
    // 开始绘制进度，60代表60%
    mprogress.draw(80);
  },
    // 事件处理函数
    bindViewTap() {
      wx.navigateTo({
        url: '../logs/logs'
      })
    },
    onLoad() {
      if (wx.getUserProfile) {
        this.setData({
          canIUseGetUserProfile: true
        })
      }
    },
    getUserProfile(e) {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    },
    getUserInfo(e) {
      // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
      console.log(e)
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    },

   data: {
    Read:'555',
    value: '2018-11-11',
    week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    lastMonth: 'lastMonth',
    nextMonth:'nextMonth',
    selectVal: '',
    open:false,
},

//组件监听事件
select(e) {
    console.log(e)
    this.setData({
        selectVal:e.detail,
      
    })
},

toggleType(){
    let value=this.data.open
    console.log(value)
    this.setData({
        open:!value
    })
    this.selectComponent('#Calendar').toggleType();
},
//结束
  data: {
      // tab切换  
      currentTab: 0,
  },
  swichNav: function (e) {
      console.log(e);
      var that = this;
      if (this.data.currentTab === e.target.dataset.current) {
          return false;
      } else {
          that.setData({
              currentTab: e.target.dataset.current,
          })
      }
  },
  swiperChange: function (e) {
      console.log(e);
      this.setData({
          currentTab: e.detail.current,
      })

  },

  onShareAppMessage: function () {
      // 用户点击右上角分享
      return {
          title: 'title', // 分享标题
          desc: 'desc', // 分享描述
          path: 'path' // 分享路径
      }
  },

  //近况提交
    data: {
      // 子tab切换  
      currentTab1: 0,
  },
  swichNav1: function (e) {
      console.log(e);
      var that = this;
      if (this.data.currentTab1 === e.target.dataset.current) {
          return false;
      } else {
          that.setData({
              currentTab1: e.target.dataset.current,
          })
      }
  },
  swiperChange1: function (e) {
      console.log(e);
      this.setData({
          currentTab1: e.detail.current,
      })

  },

  onShareAppMessage: function () {
      // 用户点击右上角分享
      return {
          title: 'title', // 分享标题
          desc: 'desc', // 分享描述
          path: 'path' // 分享路径
      }
  },
  //发布动态

  data: {
    
  },
  opendLocation(event){
    console.log(event.currentTarget.dataset.index)
    var that = this;
    wx.openLocation({
      latitude: that.data.actionsList[event.currentTarget.dataset.index].latitude,
      longitude: that.data.actionsList[event.currentTarget.dataset.index].longitude,
    })
  },
  toUserDetail(e){
    console.log(e.currentTarget.dataset.openid)
    wx.navigateTo({
      url: '/pages/stats/me1/me1?openid=' + e.currentTarget.dataset.openid,
    })
  },
  onShow(){
    this.getActionsList()
  },
  onLoad: function () {

    console.log(app.globalData.userInfo)

    var that = this;
    setTimeout(function(){
      console.log(app.globalData.openid)
      that.setData({
        myOpenid: app.globalData.openid
      })
    },2000)

  
  },
  getActionsList(){
    var that = this // desc asc
    // 模糊搜索的话加上这个
    // .where({
    //   text: wx.cloud.database().RegExp({
    //     regexp: that.data.keyValue
    //   })
    // })
    wx.cloud.database().collection('actions').orderBy('time','desc').get({
      success(res){
        console.log(res)

        //格式化时间
        var list = res.data
        for(var l in list){
          list[l].time = util.formatTime(new Date(list[l].time))
        }

        for(var l in list){
          for(var j in list[l].prizeList){

            if(list[l].prizeList[j].openid == app.globalData.openid){
              list[l].isPrized = true
            }

          }
        }
        for(var l in list){
          if(list[l].commentList.length != 0){

            for(var j in list[l].commentList){
              list[l].commentList[j].time = util.formatTime(new Date(list[l].commentList[j].time))
            }

          }
        }
        that.setData({
          actionsList :list
        })

      }
    })
  },
  topublishByq(){
    
    if(app.globalData.userInfo == null){
      wx.navigateTo({
        url: '/pages/au/au',
      })
    }else {
      wx.navigateTo({
        url: '/pages/stats/publishByq/publishByq',
      })
    }
    
  },
  toDetail(event){

    console.log(event.currentTarget.dataset.id)

    wx.navigateTo({
      url: '/pages/stats/detail/detail?id=' + event.currentTarget.dataset.id,
    })

  },

  deleteAction(event){

    console.log(event.currentTarget.dataset.id)

    var that = this;
    wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).remove({
      success(res){
        console.log(res)
        wx.showToast({
          title: '删除成功！',
        })
        that.getActionsList()
      }
    })

  },

  onPullDownRefresh(){

    this.getActionsList()

  },

  prizeAction(event){
    if(app.globalData.userInfo == null){
      wx.navigateTo({
        url: '/pages/au/au',
      })
    }else {
      console.log(event.currentTarget.dataset.id)
      var that = this;
      wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).get({
        success(res){

          console.log(res)
          var action = res.data
          var tag = false
          var index 
          for(var l in action.prizeList){
            if(action.prizeList[l].openid == app.globalData.openid){
              tag = true
              index = l
              break
            }
          }
          if(tag){
            //之前点赞过 删除点赞记录
            //action.prizeList.splice(index,1)

            //解决手机取消点赞时候设置为null的bug
            let prizeList = []
            for(let i in action.prizeList){
              if(index != i){
                prizeList.push(action.prizeList[i])
              }
            }

            console.log(action)
            wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).update({
              data: {
                prizeList: prizeList
              },
              success(res){

                console.log(res)
                that.getActionsList()

              }
            })
          }else{
            //之前未点赞  添加点赞记录
            var user = {}
            user.nickName = app.globalData.userInfo.nickName
            user.faceImg = app.globalData.userInfo.avatarUrl
            user.openid = app.globalData.openid
            action.prizeList.push(user)

            console.log(action.prizeList)
            wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).update({
              data: {
                prizeList: action.prizeList
              },
              success(res){
                console.log(res)
                wx.showToast({
                  title: '点赞成功！',
                })
                that.getActionsList()
              }
            })
          }

        }
      })

    }
    

    

  },
  delteComment(event){
    var that = this;
    console.log(event.currentTarget.dataset.id)
    console.log(event.currentTarget.dataset.index)

    wx.showModal({
      title:'提示',
      content:'确定要删除此评论吗？',
      success(res){
        if(res.confirm){
          var index = event.currentTarget.dataset.index
          wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).get({
            success(res){
              console.log(res)
              var action = res.data

              action.commentList.splice(index,1)
              wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).update({
                data: {
                  commentList: action.commentList
                },
                success(res){
                  console.log(res)
                  wx.showToast({
                    title: '删除成功',
                  })
                  that.getActionsList()
                }
              })
            }
          })
        }else if(res.cancel){

        }
      }
    })
    



  },

  onShareAppMessage(event){

    if(event.from == 'button'){
      console.log(event.target.dataset.index)
      var index = event.target.dataset.index

      return {
        title: this.data.actionsList[index].text,
        imageUrl: this.data.actionsList[index].images[0],
        path:'pages/detail/detail?id=' + this.data.actionsList[index]._id
      }
    }
    if(event.from == 'menu'){
      return {
        title: '欢迎进入朋友圈列表',
        imageUrl: '',
        path:'pages/index/index'
      }
    }
    

  },
  previewImg(event){
    var that = this;
    console.log(event)
    
    wx.previewImage({
      current: event.currentTarget.dataset.src,//当前显示图片的路径
      urls: that.data.actionsList[event.currentTarget.dataset.index].images,
    })

  },
//学习情况查看，记录学习篇数



})