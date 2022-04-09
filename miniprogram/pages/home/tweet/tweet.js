// pages/tweet/tweet.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url:'',
    },

 onLoad: function (options) {
    this.setData({
      //解码，赋值
      article:decodeURIComponent(options.url)
    });
  },
  data: {
    article:"",
  },

})