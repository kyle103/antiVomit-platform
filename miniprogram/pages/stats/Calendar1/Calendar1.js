Page({
   //日历，学习情况查看上半部分
    data: {
        value: '2018-11-11',
        week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        lastMonth: 'lastMonth',
        nextMonth:'nextMonth',
        selectVal: '',
        open:true,
    },

    //组件监听事件
    select(e) {
        // console.log(e)
        this.setData({
            selectVal:e.detail
        })
    },
    
    toggleType(){
        let value=this.data.open
        console.log(value)
        this.setData({
            open:!value
        })
        this.selectComponent('#Calendar').toggleType();
    },
//结束

})