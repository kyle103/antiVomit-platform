// pages/home/recordScore/recordScore.js
const app = getApp() // 全局APP
const _ = app.db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },
    bindTextAreaBlur: function(e) {
		this.setData({
		  inputVal:e.detail.value
		}) 
    }, 
    formSubmit: function(e) {
        var that = this
		if(app.globalData.userInfo == null){
			wx.navigateTo({
			  url: '/pages/au/au',
			})
		  }else{
			console.log(this.data.inputVal)
			if(this.data.inputVal=='')
			{}else{
				app.db.collection('EvalScore').where({
                    _openid:app.globalData.openid
                })
                .get().then(res=>{
                    console.log("查询成功",res.data.length)//打印返回结果
                    if(res.data.length==0){
                        app.db.collection('EvalScore').add({
                            data:{
                               score:this.data.inputVal
                              },
                              success:function(){
                                  console.log("添加成功")
                                  wx.showToast({
                                    title: '提交成功！',
                                    mask:true,
                                    success: function() {       
                                        that.setData({         
                                            inputVal: ''
                                        })
                                    },
                                  })
                              }
                          })
                          app.db.collection('echart').where({
                            _openid: app.globalData.openid,
                            time:app.moment().format('l')
                          })
                          .update({
                            data: {
                              times:_.inc(1)
                            },
                          })
                          setTimeout(function() {
                            wx.switchTab({  
                              url:'../home'  
                                  }); 
                          }, 1500);
                    }
                    else{
                        console.log("进入更新")
                        app.db.collection('EvalScore').where({
                            _openid:app.globalData.openid
                        })
                        .update({
                            data:{
                                score:this.data.inputVal
                            },
                        })
                            wx.showToast({
                              title: '提交成功！',
                              mask:true,
                              success: function() {       
                                  that.setData({         
                                      inputVal: ''
                                  })
                                    setTimeout(function() {
                                      wx.switchTab({  
                                        url:'../home'  
                                            }); 
                                    }, 1500);
                              },
                            })
                            app.db.collection('echart').where({
                                _openid: app.globalData.openid,
                                time:app.moment().format('l')
                              })
                              .update({
                                data: {
                                  times:_.inc(1)
                                },
                              })
                               
                    }
                   
                              
                })
                				
			    }

          }
         

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