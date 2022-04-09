// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
<<<<<<< HEAD

const request = require('request')
=======
const db = cloud.database();
>>>>>>> 1d945e35dfb7af60750f1a98c8da15f630ddd824

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
<<<<<<< HEAD
=======
    case 'searchArticles':{
      return searchArticles(event)
    }
>>>>>>> 1d945e35dfb7af60750f1a98c8da15f630ddd824
    default: {
      return
    }
  }
}

async function articleList(event) {
<<<<<<< HEAD
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
=======
  // 获取步骤
  let step = event.step || 0;
  return await db.collection('articles').skip(step).limit(10).orderBy('date','desc').get();
>>>>>>> 1d945e35dfb7af60750f1a98c8da15f630ddd824
}

async function addArticle(event){
  
}

<<<<<<< HEAD
=======
async function searchArticles(event){
  let step = event.step || 0;
  let keywords = event.keywords || "";
  let res= []
  let titleRes = await db.collection('articles').where({
    // title:/keywords/i  //不行why
    title:db.RegExp({
      regexp:keywords,
      options:'i',
    })
  }).orderBy('date','desc').get();
  let contentRes = await db.collection('articles').where({
    content:db.RegExp({
      regexp:keywords,
      options:'i',
    })
  }).orderBy('date','desc').get();
  res=titleRes.data.concat(contentRes.data)
  let array = [];
  // 去重
  for (let i = 0; i < res.length; i++) {  
      let j=0;  
      for(j=0;j<array.length;j++){
        if(res[i]._id===array[j]._id){
          break
        }
      }
      if(j===array.length){
        array.push(res[i])
      } 
  }
  // 时间排序
  array.sort(compare)
  console.log(array)
  return array;
}

function compare(a,b){
  if(a.date>b.date){
    return -1
  }
  else if(a.date<b.date){
    return 1
  }
  return 0
}

>>>>>>> 1d945e35dfb7af60750f1a98c8da15f630ddd824
