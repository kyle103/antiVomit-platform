//AppID
//APPID：wx3342629a4c7e98ad APPSecret：069b3f4769338442785b63a4b480d4f0
const app = getApp() // 全局APP
const _ = app.db.command
const APPID = "wx3342629a4c7e98ad"; //不是真是数据
//AppSecret
const APPSECRET = "069b3f4769338442785b63a4b480d4f0"; //不是真是数据
Page({
      //更新评估次数
      addTimes:function(e){
        console.log("跳转成功")
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
/*onLoad:function(){
  this.getArticleList()

},
//获取公众号文章列表
getArticleList(){
  var that=this;
  wx.request({
    url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`,
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: (res) =>{
      console.log(res);
     // var ACCESS_TOKEN=res.data.access_token;
      that.get(res.data.access_token)
    },
    error: function (res) {
      console.log(res);
    }
  })
 
   
},

get(accesstoken){
wx.request({
  url: `https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${accesstoken}`,
  method: "POST",
  data: {
    "type": 'news',
     "offset": 0,
     "count": 3
   },
  header: {
    'content-type': 'application/json' // 默认值
  },
  success: (res)=>{
    console.log('微信推文列表',res);
    var that = this;
  //定义一个数组，用于存放文章对象
  var articleArr=[];
  //获取到的文章列表数组
  console.log(res.data.item);
  var article=res.data.item;
  for(var i=0;i<article.length;i++)
  {
    var obj={
    // 公众号文章的链接url
      url:article[i].content.news_item[0].url,
      //公众号文章的封面图片地址url
      thumbUrl:article[i].content.news_item[0].thumb_url
    };
    articleArr.push(obj);
  }
  //console.log(articleArr);
  that.setData({
    //将整理好的数据赋值给swiperList
    swiperList:articleArr
  });

  data: {
  swiperList: []
  };
  },
  error: function (res) {
    console.log(res);
  }
})
},

 //点击轮播图事件
 entenArt: function (e) {
  var index=e.currentTarget.dataset.index;
  var url=this.data.swiperList[index].url;
  wx.navigateTo({
    //url太长且会被截取，编码一下，避免这种情况
    url:`../tweet/tweet?url=${encodeURIComponent(url)}`,
  });
},*/
