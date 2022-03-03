Component({
  // 组件的属性列表
  properties: {
    // 接受父组件的给的数据
    active: {
        type: "String",
        value: ""
    }
  },
  data: { 
    selected: undefined,
    color: "#333333",  //默认文字颜色
    selectedColor: "#e6a511",  //选中文字颜色
    list: [
     
      {
        "pagePath": "../../../miniprogram/pages/index1/index1",
        "text": "学习情况",
        "iconPath": "../../images/个人.png" ,// 因为子页面点击图标的不需要变化，因为直接跳转到首页了
        "selectediconPath":"../../images/聊天.png"
      },
      {
        "pagePath": "../../../miniprogram/pages/publishByq/publishByq",
        "text": "患者近况",
        "iconPath": "../../images/聊天.png"
      },
      {
        "pagePath": "../../../miniprogram/pages/index3/index3",
        "text": "分享故事",
        "iconPath": "../../images/论坛.png"
      }
  ]
  },
  attached() {
    
  },
  methods: {
    switchTab(e) {
      if (this.data.selected === e.currentTarget.dataset.index) {
        return false;
      } else {
        const url=e.currentTarget.dataset.path
        wx.switchTab({url})
      }
    },
    run() {
      console.log(this.data.active);      
      this.setData({
          // 通过this.data获取父组件里传过来的值
          selected: this.data.active
      });
      console.log(this.data.selected);
    }
  }
})