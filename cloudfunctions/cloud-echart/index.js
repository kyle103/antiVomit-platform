// 云函数入口文件
const cloud = require('wx-server-sdk')
//app.moment().format('l')
//今天日期
var now = new Date();
var a = now.getFullYear()
var b= now.getMonth() + 1
var c =now.getDate()
if(b < 10){
    b = '0' + b;
};
if(c < 10) {
    c = '0' +c;}
var today=a+"-" + b + "-" + c;
//8天前的时间
var day1 = new Date();
day1.setTime(day1.getTime()-24*60*60*1000*8);
var year = day1.getFullYear()
var month = day1.getMonth() + 1
var day = day1.getDate()
if(month < 10){
    month = '0' + month;
};
if(day < 10) {
    day = '0' + day;}
var day8= year+"-" + month + "-" + day;

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db=cloud.database()
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    //console.log(today)
  try {
      await db.collection('echart').where({
        dataType:'read',
        time:day8
      })
      .update({
        data: {
          time:today,
          times:0,
          numbers:0
        },
      }),
      await db.collection('echart').where({
        dataType:'words'
       })
       .update({
         data: {
           time:today,
           numbers:0
         },
       })
    } catch(e) {
      console.error(e)
    }
  }

