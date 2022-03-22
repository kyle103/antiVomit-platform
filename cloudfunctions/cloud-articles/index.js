// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

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
    case 'searchArticles':{
      return searchArticles(event)
    }
    default: {
      return
    }
  }
}

async function articleList(event) {
  // 获取步骤
  let step = event.step || 0;
  return await db.collection('articles').skip(step).limit(10).orderBy('date','desc').get();
}

async function addArticle(event){
  
}

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

