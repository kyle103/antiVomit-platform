
Page({
  onAdd: function () {
    const db = wx.cloud.database()
    db.collection('ReadTheArticleNumber').add({
     data: {
     count: 1
     },
     success: res => {
     // 在返回结果中会包含新创建的记录的 _id
     this.setData({
      counterId: res._id,
      count:1
     })
     wx.showToast({
      title: '新增记录成功',
     })
     console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
     },
     fail: err => {
     wx.showToast({
      icon: 'none',
      title: '新增记录失败'
     })
     console.error('[数据库] [新增记录] 失败：', err)
     }
    })
    },
    onQuery: function() {
      const db = wx.cloud.database()
      // 查询当前用户所有的 counters
      db.collection('ReadTheArticleNumber').where({
       _openid: this.data.openid
      }).get({
       success: res => {
       console.log(res);
       this.setData({
        queryResult: JSON.stringify(res.data, null, 2)
       })
       console.log('[数据库] [查询记录] 成功: ', res)
       },
       fail: err => {
       wx.showToast({
        icon: 'none',
        title: '查询记录失败'
       })
       console.error('[数据库] [查询记录] 失败：', err)
       }
      })
      },
      onCounterInc: function() {
        const db = wx.cloud.database()
        const newCount = this.data.count + 1
        db.collection('ReadTheArticleNumber').doc(this.data.counterId).update({
         data: {
         count: newCount
         },
         success: res => {
         console.log(res);
         this.setData({
          count: newCount
         })
         },
         fail: err => {
         icon: 'none',
         console.error('[数据库] [更新记录] 失败：', err)
         }
        })
        },
       
            
   

  /*f:function(){
    //首先获取是否执行过
  wx.getStorage({
    
    key: 'today',
    success: function(res) {
      //成功的话 说明之前执行过，再判断时间是否是当天
      if (res.data && res.data != new Date().toLocaleDateString()) {
        const db = wx.cloud.database()
    db.collection('ReadTheArticleNumber').add({
     data: {
     count: 1
     },
     success: res => {
     // 在返回结果中会包含新创建的记录的 _id
     this.setData({
      counterId: res._id,
      count:1
     })
     wx.showToast({
      title: '新增记录成功',
     })
     console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
     },
     fail: err => {
     wx.showToast({
      icon: 'none',
      title: '新增记录失败'
     })
     console.error('[数据库] [新增记录] 失败：', err)
     }
    })

        
      }else{
        getApp().globalData.slogin = 1;  //自定义要更改的变量 或者方法
      }
    },
    fail: function(res) {
  //没有执行过的话 先存一下当前的执行时间
      console.log(res);
      getApp().globalData.slogin = 0; //自定义要更改的变量 或者方法 
      wx.setStorage("today", new Date().toLocaleDateString());
    }
  })
  },
*/
})
 
 