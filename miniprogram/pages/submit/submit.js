const util=require("../../util/util")
const app=getApp()
Page({
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


})