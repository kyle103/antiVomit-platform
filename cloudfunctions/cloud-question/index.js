const cloud = require('wx-server-sdk')
// 时间工具类
const timeutil = require('./timeutil');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'search': {
      return search(event)
    }
    case 'myQuestion': {
      return myQuestion(event)
    }
    case 'questionDetail': {
      return questionDetail(event)
    }
    case 'questionList': {
      return questionList(event)
    }
    case 'addQuestion': {
      return addQuestion(event)
    }
    case 'answerQuestion': {
      return answerQuestion(event)
    }
    default: {
      return
    }
  }
  
}

async function search(event) {
  let keywords = event.keywords || "";
  return await db.collection('questions').where({
    name:db.RegExp({
      regexp:keywords,
      options:'i',
    })
  }).get();
}

async function myQuestion(event) {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID;
  return await db.collection('questions').where({
    openid
  }).get();
}

async function questionDetail(event) {
  return await db.collection('questions').where({
    _id:event.index
  }).get();
}

async function questionList(event) {
  return await db.collection('questions').get();
}

async function addQuestion(event) {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID;
  let {question}=event
  let qtime = timeutil.TimeCode()
  return await db.collection('questions').add({
    data:{
      openid,question,qtime,
      answers:[],
      answerNum:0
    }
  });
}

async function answerQuestion(event) {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID;
  let answer = {
    answer:event.myanswer,
    atime:timeutil.TimeCode(),
    openid
  }
  return await db.collection('questions').doc(event._id).update({
    data:{
      answers:_.push(answer),
      answerNum:_.inc(1)
    }
  });
}