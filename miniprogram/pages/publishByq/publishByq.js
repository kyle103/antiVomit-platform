const app=getApp()
Page({
  data: {
    cloudImgList:[]
  },

  onLoad: function (options) {
    console.log(app.globalData.userInfo)
  },
  getValue(e){
    console.log(e.detail.value)
    this.setData({
      inputValue:e.detail.value
    })
  },
  chooseImage(){
    var that=this;
    wx.chooseImage({
      count: 9 - that.data.cloudImgList.length,
      sizeType:['original','compressed'],
      sourceType:['album','camera'],
      success(res){
        console.log(res)
        console.log(res.tempFilePaths)//上传图片
        that.data.tempImgList=res.tempFilePaths
        that.uplodImages()
      }
    })
  },

  uplodImages(){
    var that=this;
    for(var i=0;i<this.data.tempImgList.length;i++){
      wx.cloud.uploadFile({
        cloudPath:`actionImages/${Math.random()}_${Date.now()}.${this.data.tempImgList
        [i].match(/\.(\w+)$/)[1]}`,
        filePath:this.data.tempImgList[i],
        success(res){
          console.log(res.fileID)
          that.data.cloudImgList.push(res.fileID)
          that.setData({
            cloudImgList:that.data.cloudImgList
          })

        }
      })
    }
  },
  deleteImg(e){
    console.log(e.currentTarget.dataset.index)
    this.data.cloudImgList.splice(e.currentTarget.dataset.index,1)
    this.setData({
      cloudImgList:this.data.cloudImgList
    })
  },
  submitData(){
    wx.cloud.database().collection('actions').add({
      data:{
        nickName:app.globalData.userInfo.nickName,
        faceImg:app.globalData.userInfo.avatarUrl,
        text:this.data.inputValue,
        images:this.data.cloudImgList,
        time:Date.now(),
        prizeList:[]
      },
      success(res){
        console.log(res)
        wx.navigateBack({
          success(res){
            wx.showToast({
              title: '发布成功！',
            })
          }
        })
      }
    })
  },
  onShareAppMessage: function () {

  }
})