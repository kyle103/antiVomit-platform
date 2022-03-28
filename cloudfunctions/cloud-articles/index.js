// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const request = require('request')

// 云函数入口函数
exports.main = async (event, context) => {
  // console.log(event)
  switch (event.action) {
    case 'articleList': {
      return articleList(event)
    }
    case 'addArticle': {
      return addArticle(event)
    }
    default: {
      return
    }
  }
}

async function articleList(event) {
  request({
    method: 'POST',
    url: 'http://api.weixin.qq.com/cgi-bin/material/batchget_material',
    data: {
      type: 'news',
      offset:0,
      count:20
    },
    header:{
      'content-type': 'application/x-www-form-urlencoded'
    },
    success(res){
      console.log(res)
      return res
    },
    fail (err){
      console.log(err)
    }
  })
}

async function addArticle(event){
  
}

