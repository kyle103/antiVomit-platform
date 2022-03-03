// pages/detail/detail.js
const util = require("../../util/util");
const app=getApp()
Page({
  data: {

  },

  onLoad: function (options) {
    
    this.setData({
      openid :app.globalData.openid
    })
    console.log(options.id)
    this.data.id=options.id
    this.getDetail()
  },
  getDetail(){
    var that=this;
    wx.cloud.database().collection(`actions`).doc(this.data.id).get({
      success(res){
        console.log(res)
        var action=res.data
        action.time=util.formatTime(new Date(action.time))
        that.setData({
          action:res.data
        })
      }
    })
  },
  delete(){
    console.log(this.data.id)
    var that = this;
    wx.cloud.database().collection(`actions`) .doc(this.data.id).remove({
      success(res){
        console.log(res)
        wx.navigateBack({
          success(res){
            wx.showToast({
              title: '删除成功！',
            })

          }
        })
        that.getDetail()
      }
    })
  },
  prizeAction(){
    var that=this
    if(app.globalData.userInfo==null){
      wx.navigateTo({
        url:  '/pages/au/au',
      })
    }else{
      console.log(that.data.id)
      var that=this;
      wx.cloud.database().collection(`actions`).doc(that.data.id).get({
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
            
            wx.cloud.database().collection(`actions` ).doc(that.data.id).update({
              data:{
                prizeList:action.prizeList
              },
              success(res){
                
                console.log(res)
                that.getDetail()
              }
            })
          }else{
            var user={}
          user.nickName=app.globalData.userInfo.nickName
          user.faceImg=app.globalData.userInfo.avatarUrl
          user.openid=app.globalData.openid
          action.prizeList.push(user)

          console.log(action.prizeList)
          wx.cloud.database().collection(`actions`).doc(that.data.id).update({
            data:{
              prizeList:action.prizeList
            },
            success(res){
              console.log(res)
              wx.showToast({
                title: '点赞成功！',
              })
              that.getDetail()
            }
          })

          }
          
          
        }
    })

    }
   
  },
  getInputValue(event){

    console.log(event.detail.value)

    this.data.inputValue = event.detail.value
    
  },
})