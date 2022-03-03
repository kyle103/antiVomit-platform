const util=require("../../util/util")
const app=getApp()
Page({
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
  topublishByq(){
  if(app.globalData.userInfo==null){
    wx.navigateTo({
      url: '/pages/au/au',
    })
  }
  else{
    wx.navigateTo({
      url: '/pages/publishByq/publishByq',
    })
  }
},


toDetail(event){

  console.log(event.currentTarget.dataset.id)

  wx.navigateTo({
    url: '/pages/detail/detail?id=' + event.currentTarget.dataset.id,
  })

},

  onLoad:function(){
    console.log(app.globalData.userInfo)

    var that=this;
    setTimeout(function(){
      console.log(app.globalData.openid)
      that.setData({
        myOpenid:app.globalData.openid
      })
    },2000)
    this.getActionList()
  },

    getActionList(){
    var that=this
    wx.cloud.database().collection('actions').orderBy('time','desc').get({
      success(res){
        console.log(res)
        //格式化时间
        var list=res.data
        for(var  l in list){
          list[l].time=util.formatTime(new Date(list[l].time))
        }
        for(var  l in list){
          for(var j in list[l].prizeList){
            if(list[l].prizeList[j].openid==app.globalData.openid){
              list[l].isPrized=true
            }
          }

          
        }
        that.setData({
          actionsList: list
        })

      }
    })
    },

  
  deleteAction(event){

    console.log(event.target.dataset.id)
    var that = this;
    wx.cloud.database().collection(`actions`) .doc(event.target.dataset.id).remove({
      success(res){
        console.log(res)
        wx.showToast({
          title: '删除成功！',
        })
        that.getActionList()
      }
    })
  },
  onPullDownRefresh(){

    this.getActionList()
  },
  prizeAction(event){
    if(app.globalData.userInfo==null){
      wx.navigateTo({
        url:  '/pages/au/au',
      })
    }else{
      console.log(event.currentTarget.dataset.id)
      var that=this;
      wx.cloud.database().collection(`actions`).doc(event.currentTarget.dataset.id).get({
        success(res){
          console.log(res)
          var action= res.data
          var tag=false
          var index
          for(var l in action.prizeList){
            if(action.prizeList[l].openid==app.globalData.openid){
              tag=true
              index=l
              break
            }
          }
          if(tag){//点赞后取消点赞
            action.prizeList.splice(index,l)

            console.log(action)
            
            wx.cloud.database().collection(`actions` ).doc(event.currentTarget.dataset.id).update({
              data:{
                prizeList:action.prizeList
              },
              success(res){
                
                console.log(res)
                that.getActionsList()
              }
            })
          }else{
            var user={}
          user.nickName=app.globalData.userInfo.nickName
          user.faceImg=app.globalData.userInfo.avatarUrl
          user.openid=app.globalData.openid
          action.prizeList.push(user)

          console.log(action.prizeList)
          wx.cloud.database().collection(`actions`).doc(event.currentTarget.dataset.id).update({
            data:{
              prizeList:action.prizeList
            },
            success(res){
              console.log(res)
              wx.showToast({
                title: '点赞成功！',
              })
              that.getActionList()
            }
          })

          }
          
          
        }
    })

    }
    
   
  }
})