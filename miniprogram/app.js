const moment = require('./util/moment.min.js'); // 时间处理插件
moment.updateLocale('en', {
  longDateFormat: {
    l: "YYYY-MM-DD",
    L: "YYYY-MM-DD HH:mm:ss"
  }
});
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env:"cloud1-1g1funj3c1f0e32e",
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
        
      });
      this.db = wx.cloud.database()
      this.moment = moment
      if(wx.getStorageInfoSync('openid')){
        this.globalData.openid=wx.getStorageInfoSync('openid')
      }
      
    if(wx.getStorageSync('userInfo')){
      this.globalData.userInfo = wx.getStorageSync('userInfo')
    }

      
      var that = this;
      wx.cloud.callFunction({
        name:"getUserOpenid",
        success(res){
          console.log(res.result.openid)
          that.globalData.openid=res.result.openid
          wx.setStorageSync('openid', res.result.openid)
        }
      })     
    }
    
  },
  globalData :{
   
    userInfo:null,
    openid:null
  },
  dataset({ currentTarget: { dataset }, detail: { value } }) {
    dataset.value = value
    return dataset
  },
  /**
   * 封装的云函数调用方法
   * @param {*} obj 传入对象
   */
  async call(obj) {
    try {
      const cloud = await this.cloud()
      const res = await cloud.callFunction({ // 调用云函数
        name: 'quickstartFunctions', // 应用唯一的服务函数
        data: {
          type: obj.name, // 传入name为type
          data: obj.data // 传入data为data
        }
      })
      console.log('【云函数调用成功】', res)
      if (res.result.name === 'invite') {
        if (res.result.data !== false) { // 如果返回值不为false，则证明正常访问
          return res.result.data
        } else { // 否则
          wx.hideLoading()
          wx.showModal({ // 提示一下
            content: '函数服务没有支持该操作！',
            showCancel: false
          })
        }
      } else {
        // 不同模版的云函数服务均共享quickstartFunctions名字
        // 如果你访问部署多个时，会出现此问题，重新部署即可
        wx.hideLoading()
        wx.showModal({
          content: '云函数quickstartFunctions被其他模版覆盖，请更新上传西数后再次体验',
          showCancel: false
        })
      }
    } catch (e) { // 网络问题出现
      console.error('【云函数调用失败】', e.toString())
      wx.hideLoading()
      wx.showModal({
        content: '请上传cloudfunctions文件夹中的云函数，然后再次体验', // 此提示可以在正式时改为 "网络服务异常，请确认网络重新尝试！"
        showCancel: false
      })
    }
  }
 
});
