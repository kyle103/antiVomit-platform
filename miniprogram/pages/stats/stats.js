const app = getApp() // 全局APP
const util=require("../../util/util")
import * as echarts from '../../ec-canvas/echarts';
let barChart, pieChart, lineChart, pieScoreChart
Page({
	//为新用户添加学习记录
	onReady :function (e) {
		//console.log(app.globalData.openid)
		app.db.collection('echart').where({
			_openid: app.globalData.openid,
			time:app.moment().format('l')
		  }).
		 get().then(res=>{
		console.log("查询成功",res.data)//打印返回结果
		if(res.data.length==0){
			for(var i=0;i<=7;i++){//获取日期
				var day1 = new Date();
				day1.setTime(day1.getTime()-24*60*60*1000*i);
				var year = day1.getFullYear()
				var month = day1.getMonth() + 1
				var day = day1.getDate()
				if(month < 10){
					month = '0' + month;
				};
				if(day < 10) {
					day = '0' + day;}
				var theday= year+"-" + month + "-" + day;
				//
				app.db.collection('echart').add({
					data:{
					  _openid: app.globalData.openid,
					  dataType:'read',
					  numbers:0,
					  time:theday,
					  times:0
					},
						success(res){
							console.log("添加记录成功")
						}
					  })
			  }
	
		}
    }).catch(err=>{
		  console.log("查询失败",err)
    })
		
	},
	data: {
		inputVal: "",//近况提交内容记录
		workTypeArr: ['学习情况查看', '患者近况', '分享抗癌故事'],
		selected: 0,
		patient: true, // 是否是患者填写
		ecBar: {
			onInit: function (canvas, width, height, devicePixelRatio) {
				barChart = echarts.init(canvas, null, { width, height, devicePixelRatio });
				canvas.setChart(barChart);
				const option = {
					xAxis: {
						type: 'category',
						data: ['01', '02', '03', '04', '05', '06', '07'],
						axisLabel: { fontSize: 16 },
					},
					yAxis: { show: true },
					series: [
						{
							data: [1,1,1,1,1,1,1],
							type: 'bar',
							showBackground: true,
							backgroundStyle: {
								color: 'rgba(180, 180, 180, 0.2)',
								borderRadius: 10,
							},
							barWidth: 12,
							itemStyle: {
								color: 'rgba(98, 2, 250)',
								borderRadius: 10,
							}
						}
					]
				};
				barChart.setOption(option);
				return barChart;
			}
		},
		ecPie: {
			onInit: function (canvas, width, height, devicePixelRatio) {
				pieChart = echarts.init(canvas, null, { width, height, devicePixelRatio });
				canvas.setChart(pieChart);
				var option = {
					title: [{
						text: '今日已阅读字数',
						left: '50%',
						top: '30%',
						textAlign: 'center',
						textStyle: {
							fontSize: '15',
							fontWeight: '400',
							color: 'rgba(0,0,0,0.40)',
							textAlign: 'center',
						},
					}, {
						text: '0',
						x: '50%',
						y: '45%',
						textAlign: 'center',
						textStyle: {
							fontSize: '24',
							fontWeight: '600',
							color: 'rgba(0,0,0,0.90)',
							textAlign: 'center',
						},
					}, {
						text: '目标：10000字',
						left: '50%',
						top: '60%',
						textAlign: 'center',
						textStyle: {
							fontSize: '15',
							fontWeight: '400',
							color: 'rgba(0,0,0,0.40)',
							textAlign: 'center',
						},
					}],
					series: [{
						type: 'pie',//指定类型为饼状图
						clockWise: true,
						radius: ['70%', '70%'],//指定半径，注意不建议直接指定px，不利于自适应。
						itemStyle: {
							normal: {
								label: { show: false },
								labelLine: { show: false }
							}
						},
						hoverAnimation: false,
						data: [{
							value: 0,
							name: 'completed',
							itemStyle: {
								borderWidth: 10,
								borderColor: {
									colorStops: [
										{ offset: 0, color: '#F13577' } // 0% 处的颜色
										, { offset: 1, color: '#6076E1' } // 100% 处的颜色
									]
								},
							},
						}, {
							name: 'gap',
							value: 100,
							label: { show: false },
							labelLine: { show: false },
							itemStyle: {
								color: '#f0f0f0',
								borderColor: '#f0f0f0',
								borderWidth: 10
							}
						}]
					}]
				};
				pieChart.setOption(option);
				pieChart.resize();
				return pieChart;
			}
		},
		ecLine: {
			onInit: function (canvas, width, height, devicePixelRatio) {
				lineChart = echarts.init(canvas, null, { width, height, devicePixelRatio });
				canvas.setChart(lineChart);
				var option = {
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
					},
					yAxis: {
						type: 'value',
						splitLine: { show: false },
						axisLine: { show: true },
						axisTick: { show: true },
					},
					series: [
						{
							data: [1,1,1,1,1,1,1],
							type: 'line',
							smooth: true,
							areaStyle: { color: 'rgb(98,2,250)', opacity: 1 }
						}
					]
				};
				lineChart.setOption(option);
				lineChart.resize();
				return lineChart;
			}
		},
		ecPieScore: {
			onInit: function (canvas, width, height, devicePixelRatio) {
				var value = 80;//这里控制着圆环图的进度，最近一次评估得分
				pieScoreChart = echarts.init(canvas, null, { width, height, devicePixelRatio });
				canvas.setChart(pieScoreChart);
				var option = {
					title: [{
						text: value,
						x: '50%',
						y: '40%',
						textAlign: 'center',
						textStyle: {
							fontSize: '24',
							fontWeight: '600',
							color: 'rgba(0,0,0,0.90)',
							textAlign: 'center',
						},
					}, {
						text: 'SCORE',
						left: '50%',
						top: '55%',
						textAlign: 'center',
						textStyle: {
							fontSize: '16',
							fontWeight: '400',
							color: 'rgba(0,0,0,0.40)',
							textAlign: 'center',
						},
					}],
					series: [{
						type: 'pie',//指定类型为饼状图
						clockWise: true,
						radius: ['70%', '70%'],//指定半径，注意不建议直接指定px，不利于自适应。
						itemStyle: {
							normal: {
								label: { show: false },
								labelLine: { show: false }
							}
						},
						hoverAnimation: false,
						data: [
							{
								value,
								name: 'completed',
								label: { show: false },
								labelLine: { show: false },
								itemStyle: {
									color: 'rgb(93,75,255)',
									borderColor: 'rgb(93,75,255)',
									borderWidth: 25
								}
							}, {
								name: 'gap',
								value: 100 - value,
								label: { show: false },
								labelLine: { show: false },
								itemStyle: {
									color: '#f0f0f0',
									borderColor: '#f0f0f0',
									borderWidth: 25
								}
							}]
					}]
				};
				pieScoreChart.setOption(option);
				pieScoreChart.resize();
				return pieScoreChart;
			}
		},
	},
	/*onShow() {
		// 延时获取图表数据
		const that = this
		setTimeout(() => {
			that.updateBar()
			that.updatePie()
			console.log("here",e)
		}, 500)
		
	},*/
	/**
 * 选择
 */
	handleSelect: function (e) {
		const { index } = app.dataset(e)
		this.setData({ selected: index, patient: true })
		if (index == 0) {
			this.updateBar()
			this.updatePie()
		}
	},
	handleTap(e) {
		const { patient } = app.dataset(e)
		this.setData({ patient: patient == 1 })
		if (!this.data.patient) this.updateLine()
	},
	// 更新bar图表
	updateBar() {
		const endTime = app.moment().format('l')
		const startTime = app.moment().subtract(7, 'd').format('l')//横轴
		const _ = app.db.command
		app.db.collection('echart').where({ _openid: app.globalData.openid, dataType: 'read', time: _.gte(startTime).and(_.lte(endTime)) }).orderBy('time', 'asc').get({
			success: ({ data }) => {
				if (data.length > 0) {
					const xData = data.map(item => item.time.slice(-2))
					const yData = data.map(item => item.numbers)//数据来自echart.numbers
					const option = {
						xAxis: {
							type: 'category',
							data: xData,
							axisLabel: { fontSize: 16 },
						},
						yAxis: { show: true, splitLine: { show: false }, axisLine: { show: true }, axisTick: { show: true }, },
						series: [
							{
								data: yData,
								type: 'bar',
								showBackground: true,
								backgroundStyle: {
									color: 'rgba(180, 180, 180, 0.2)',
									borderRadius: 10,
								},
								barWidth: 12,
								itemStyle: {
									color: 'rgba(98, 2, 250)',
									borderRadius: 10,
								}
							}
						]
					};
					barChart.setOption(option);
					barChart.resize()
				}
			}
		})
	},
	// 更新阅读字数图表
	updatePie() {
		// 根据数据库查询更新
		const time = app.moment().format('l')
		app.db.collection('echart').where({ time, dataType: 'words' }).get({
			success: ({ data }) => {
				if (data.length > 0) {
					console.log(data)
					const { numbers } = data[0]
					const rate = parseInt(numbers / 100) // 已阅读 百分比
					const option = {
						title: [{
							text: '今日已阅读字数',
							left: '50%',
							top: '30%',
							textAlign: 'center',
							textStyle: {
								fontSize: '15',
								fontWeight: '400',
								color: 'rgba(0,0,0,0.40)',
								textAlign: 'center',
							},
						}, {
							text: numbers + '',
							x: '50%',
							y: '45%',
							textAlign: 'center',
							textStyle: {
								fontSize: '24',
								fontWeight: '600',
								color: 'rgba(0,0,0,0.90)',
								textAlign: 'center',
							},
						}, {
							text: '目标：10000字',
							left: '50%',
							top: '60%',
							textAlign: 'center',
							textStyle: {
								fontSize: '15',
								fontWeight: '400',
								color: 'rgba(0,0,0,0.40)',
								textAlign: 'center',
							},
						}],
						series: [{
							type: 'pie',//指定类型为饼状图
							clockWise: true,
							radius: ['70%', '70%'],//指定半径，注意不建议直接指定px，不利于自适应。
							itemStyle: {
								normal: {
									label: { show: false },
									labelLine: { show: false }
								}
							},
							hoverAnimation: false,
							data: [{
								value: rate,
								name: 'completed',
								itemStyle: {
									borderWidth: 10,
									borderColor: {
										colorStops: [
											{ offset: 0, color: '#F13577' } // 0% 处的颜色
											, { offset: 1, color: '#6076E1' } // 100% 处的颜色
										]
									},
								},
							}, {
								name: 'gap',
								value: 100 - rate,
								label: { show: false },
								labelLine: { show: false },
								itemStyle: {
									color: '#f0f0f0',
									borderColor: '#f0f0f0',
									borderWidth: 10
								}
							}]
						}]
					};
					pieChart.setOption(option);
					pieChart.resize()
				}
			}
		})
	},
	// 更新line图表
	updateLine() {
		const endTime = app.moment().format('l')
		const startTime = app.moment().subtract(7, 'd').format('l')//横轴
		const _ = app.db.command
		app.db.collection('echart').where({ _openid: app.globalData.openid, dataType: 'read', time: _.gte(startTime).and(_.lte(endTime)) }).orderBy('time', 'asc').get({
			success: ({ data }) => {
				if (data.length > 0) {
					const xData = data.map(item => item.time.slice(-2))
					const yData = data.map(item => item.times)//图表二数据来自echart.times
					const option = {
						xAxis: {
							type: 'category',
							boundaryGap: false,
							data: xData,
						},
						yAxis: {
							type: 'value',
							splitLine: { show: false },
						},
						series: [
							{
								data: yData,
								type: 'line',
								smooth: true,
								areaStyle: { color: 'rgb(98,2,250)', opacity: 1 }
							}
						]
					};
					lineChart.setOption(option);
					lineChart.resize()
				}
			}
		})
	},
	//提交近况
	bindTextAreaBlur: function(e) {
		this.setData({
		  inputVal:e.detail.value
		}) 
	},    
	formSubmit: function(e) {
		if(app.globalData.userInfo == null){
			wx.navigateTo({
			  url: '/pages/au/au',
			})
		  }else{
			console.log(this.data.inputVal)
			if(this.data.inputVal=="")
			{}else{
				wx.cloud.database().collection('statusRecords').add({
					data:{
					  text:this.data.inputVal,
					  time:Date.now(),
					  nickName:app.globalData.userInfo.nickName,
					},
						success(res){
						  wx.hideLoading({
							success: (res) => {},
						  })
						  wx.showToast({
							title: '提交成功！',
							mask:true
						  })
						}
					  })
			}

		  }

	},
	//发布动态
	getUserProfile(e) {
		// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
		wx.getUserProfile({
		  desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
		  success: (res) => {
			console.log(res)
			this.setData({
			  userInfo: res.userInfo,
			  hasUserInfo: true
			})
		  }
		})
	  },
	getUserInfo(e) {
		// 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
		console.log(e)
		this.setData({
		  userInfo: e.detail.userInfo,
		  hasUserInfo: true
		})
	  },
	  opendLocation(event){
		console.log(event.currentTarget.dataset.index)
		var that = this;
		wx.openLocation({
		  latitude: that.data.actionsList[event.currentTarget.dataset.index].latitude,
		  longitude: that.data.actionsList[event.currentTarget.dataset.index].longitude,
		})
	  },
	  toUserDetail(e){
		console.log(e.currentTarget.dataset.openid)
		wx.navigateTo({
		  url: '/pages/stats/me1/me1?openid=' + e.currentTarget.dataset.openid,
		})
	  },
	  
	  onShow(){
/*		var day1 = new Date();
		day1.setTime(day1.getTime()-24*60*60*1000*7);
		var year = day1.getFullYear()
		var month = day1.getMonth() + 1
		var day = day1.getDate()
		if(month < 10){
			month = '0' + month;
		};
		if(day < 10) {
			day = '0' + day;}
		var day7= year+"-" + month + "-" + day;
		console.log(day7)
		*/
		this.getActionsList()
		const that = this
		setTimeout(() => {
			that.updateBar()
			that.updatePie()
		}, 350)
	  },
	  onLoad: function () {
	
		console.log(app.globalData.userInfo)
	
		var that = this;
		setTimeout(function(){
		  console.log(app.globalData.openid)
		  that.setData({
			myOpenid: app.globalData.openid
		  })
		},2000)
	
	  
	  },
	  getActionsList(){
		var that = this // desc asc
		// 模糊搜索的话加上这个
		// .where({
		//   text: wx.cloud.database().RegExp({
		//     regexp: that.data.keyValue
		//   })
		// })
		wx.cloud.database().collection('actions').orderBy('time','desc').get({
		  success(res){
			console.log(res)
	
			//格式化时间
			var list = res.data
			for(var l in list){
			  list[l].time = util.formatTime(new Date(list[l].time))
			}
	
			for(var l in list){
			  for(var j in list[l].prizeList){
	
				if(list[l].prizeList[j].openid == app.globalData.openid){
				  list[l].isPrized = true
				}
	
			  }
			}
			for(var l in list){
			  if(list[l].commentList.length != 0){
	
				for(var j in list[l].commentList){
				  list[l].commentList[j].time = util.formatTime(new Date(list[l].commentList[j].time))
				}
	
			  }
			}
			that.setData({
			  actionsList :list
			})
	
		  }
		})
	  },
	  topublishByq(){
		
		if(app.globalData.userInfo == null){
		  wx.navigateTo({
			url: '/pages/au/au',
		  })
		}else {
		  wx.navigateTo({
			url: '/pages/stats/publishByq/publishByq',
		  })
		}
		
	  },
	  toDetail(event){
	
		console.log(event.currentTarget.dataset.id)
	
		wx.navigateTo({
		  url: '/pages/stats/detail/detail?id=' + event.currentTarget.dataset.id,
		})
	
	  },
	
	  deleteAction(event){
	
		console.log(event.currentTarget.dataset.id)
	
		var that = this;
		wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).remove({
		  success(res){
			console.log(res)
			wx.showToast({
			  title: '删除成功！',
			})
			that.getActionsList()
		  }
		})
	
	  },
	
	  onPullDownRefresh(){
	
		this.getActionsList()
	
	  },
	
	  prizeAction(event){
		if(app.globalData.userInfo == null){
		  wx.navigateTo({
			url: '/pages/au/au',
		  })
		}else {
		  console.log(event.currentTarget.dataset.id)
		  var that = this;
		  wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).get({
			success(res){
	
			  console.log(res)
			  var action = res.data
			  var tag = false
			  var index 
			  for(var l in action.prizeList){
				if(action.prizeList[l].openid == app.globalData.openid){
				  tag = true
				  index = l
				  break
				}
			  }
			  if(tag){
				//之前点赞过 删除点赞记录
				//action.prizeList.splice(index,1)
	
				//解决手机取消点赞时候设置为null的bug
				let prizeList = []
				for(let i in action.prizeList){
				  if(index != i){
					prizeList.push(action.prizeList[i])
				  }
				}
	
				console.log(action)
				wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).update({
				  data: {
					prizeList: prizeList
				  },
				  success(res){
	
					console.log(res)
					that.getActionsList()
	
				  }
				})
			  }else{
				//之前未点赞  添加点赞记录
				var user = {}
				user.nickName = app.globalData.userInfo.nickName
				user.faceImg = app.globalData.userInfo.avatarUrl
				user.openid = app.globalData.openid
				action.prizeList.push(user)
	
				console.log(action.prizeList)
				wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).update({
				  data: {
					prizeList: action.prizeList
				  },
				  success(res){
					console.log(res)
					wx.showToast({
					  title: '点赞成功！',
					})
					that.getActionsList()
				  }
				})
			  }
	
			}
		  })
	
		}
		
	
		
	
	  },
	  delteComment(event){
		var that = this;
		console.log(event.currentTarget.dataset.id)
		console.log(event.currentTarget.dataset.index)
	
		wx.showModal({
		  title:'提示',
		  content:'确定要删除此评论吗？',
		  success(res){
			if(res.confirm){
			  var index = event.currentTarget.dataset.index
			  wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).get({
				success(res){
				  console.log(res)
				  var action = res.data
	
				  action.commentList.splice(index,1)
				  wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).update({
					data: {
					  commentList: action.commentList
					},
					success(res){
					  console.log(res)
					  wx.showToast({
						title: '删除成功',
					  })
					  that.getActionsList()
					}
				  })
				}
			  })
			}else if(res.cancel){
	
			}
		  }
		})
		
	
	
	
	  },
	
	  onShareAppMessage(event){
	
		if(event.from == 'button'){
		  console.log(event.target.dataset.index)
		  var index = event.target.dataset.index
	
		  return {
			title: this.data.actionsList[index].text,
			imageUrl: this.data.actionsList[index].images[0],
			path:'pages/detail/detail?id=' + this.data.actionsList[index]._id
		  }
		}
		if(event.from == 'menu'){
		  return {
			title: '欢迎进入朋友圈列表',
			imageUrl: '',
			path:'pages/index/index'
		  }
		}
		
	
	  },
	  previewImg(event){
		var that = this;
		console.log(event)
		
		wx.previewImage({
		  current: event.currentTarget.dataset.src,//当前显示图片的路径
		  urls: that.data.actionsList[event.currentTarget.dataset.index].images,
		})
	
	  },

})
