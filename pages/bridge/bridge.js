// pages/bridge/bridge.js

Page({
  data: {
    dailyTip: '当你感到被催婚压力困扰时，试着深呼吸，记住：你的价值不由婚姻状态定义。'
  },

  onLoad() {
    this.loadDailyTip()
  },

  // 加载每日建议
  loadDailyTip() {
    const tips = [
      '当你感到被催婚压力困扰时，试着深呼吸，记住：你的价值不由婚姻状态定义。',
      '理解父母的焦虑，但也要守住自己的底线。沟通是双向的，不是单方面的妥协。',
      '试试用"我理解您担心，但是..."的句式，先肯定对方，再表达自己。',
      '避免在饭桌上谈论敏感话题，可以选择散步时单独和父母聊聊。',
      '记住，你不是在对抗父母，而是在为自己的人生负责。',
      '分享一些你生活中的快乐和成就，让父母看到你过得很好。',
      '当话题走向催婚时，可以主动聊聊其他他们感兴趣的话题。',
      '保持耐心，观念的改变需要时间，慢慢来。',
      '有时候，幽默是最好的化解方式，试试用轻松的语气回应。',
      '你的幸福是你自己的定义，不要活在别人的期待里。'
    ]

    // 根据日期选择
    const today = new Date().getDate()
    const index = today % tips.length

    this.setData({
      dailyTip: tips[index]
    })
  },

  // 给父母的一封信
  openLetter() {
    wx.navigateTo({
      url: '/pages/bridge/letter'
    })
  },

  // 沟通指南
  openGuide() {
    wx.navigateTo({
      url: '/pages/bridge/guide'
    })
  },

  // 心理自测
  openTest() {
    wx.navigateTo({
      url: '/pages/bridge/test'
    })
  },

  // 应对技巧
  openTips() {
    wx.navigateTo({
      url: '/pages/bridge/tips'
    })
  }
})
