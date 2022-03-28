const util=require("../../../util/util")
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


})