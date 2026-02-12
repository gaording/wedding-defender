// pages/index/index.js
const app = getApp()
const { getStorage, setStorage } = require('../../utils/util.js')

Page({
  data: {
    dailyBuff: '点击查看今日运势',
    dailyQuote: '优秀的你值得等待，优秀的婚姻也值得等待。',
    dailyQuoteAuthor: '',
    achievements: {
      defenseCount: 0,
      diaryCount: 0,
      communityPosts: 0,
      loginDays: 0
    },
    titles: [],
    hotTopics: [
      '如何应对七大姑八大姨',
      '春节相亲避坑指南',
      '跟父母谈心的技巧',
      '单身也可以很精彩',
      '催婚经典回应话术'
    ]
  },

  onLoad() {
    this.loadData()
    this.generateDailyBuff()
    this.loadDailyQuote()
  },

  onShow() {
    this.loadData()
  },

  // 加载数据
  loadData() {
    const achievements = app.globalData.achievements
    const titles = app.globalData.titles

    this.setData({
      achievements,
      titles
    })
  },

  // 生成今日buff
  generateDailyBuff() {
    const buffs = [
      '今日亲戚心情较好，催婚概率降低30%',
      '你的话术攻击力+10',
      '获得一个万能借口："在忙工作"',
      '今天适合跟父母深度聊天',
      '太极拳宗师附体，转移话题能力MAX',
      '今日不宜正面硬刚，宜用幽默化解',
      '获得"暂时隐身"buff，可以少回答一个问题',
      '今日悟性+5，可以理解父母的一片苦心',
      '沟通技巧UP，成功率+20%',
      '今日魅力值满格，说不定能遇到缘分'
    ]

    // 根据日期随机选择（每天固定）
    const today = new Date().getDate()
    const index = today % buffs.length

    this.setData({
      dailyBuff: buffs[index]
    })
  },

  // 加载每日一句
  loadDailyQuote() {
    const quotes = [
      { text: '优秀的你值得等待，优秀的婚姻也值得等待。', author: '' },
      { text: '婚姻是一本书，第一章写的是诗篇，而其余则是平淡的散文。', author: '尼克斯' },
      { text: '与其在别人的剧本里当配角，不如在自己的故事里当主角。', author: '' },
      { text: '单身不是一种缺陷，而是一种选择的状态。', author: '' },
      { text: '幸福的婚姻是相同的，不幸的婚姻各有各的不幸。', author: '托尔斯泰' },
      { text: '等待不是浪费时间，而是为了遇到对的人。', author: '' },
      { text: '婚姻不是终点，而是另一段旅程的起点。', author: '' },
      { text: '宁可高傲地发霉，也不要卑微地恋爱。', author: '' },
      { text: '爱情是两个人的事，婚姻是两个家庭的事。', author: '' },
      { text: '人生没有标准答案，婚姻也不是必须的选项。', author: '' }
    ]

    // 根据日期随机选择
    const today = new Date().getDate()
    const index = today % quotes.length

    this.setData({
      dailyQuote: quotes[index].text,
      dailyQuoteAuthor: quotes[index].author
    })
  },

  // 点击buff
  onBuffTap() {
    wx.showToast({
      title: '今日运势已生效',
      icon: 'success',
      duration: 2000
    })
  },

  // 跳转武器库
  goToArsenal() {
    wx.switchTab({
      url: '/pages/arsenal/arsenal'
    })
  },

  // 跳转日记
  goToDiary() {
    wx.navigateTo({
      url: '/pages/diary/diary'
    })
  },

  // 跳转社区
  goToCommunity() {
    wx.switchTab({
      url: '/pages/community/community'
    })
  },

  // 跳转游戏
  goToGame() {
    wx.navigateTo({
      url: '/pages/game/game'
    })
  },

  // 跳转话题
  goToTopic(e) {
    const topic = e.currentTarget.dataset.topic
    wx.navigateTo({
      url: `/pages/community/community?topic=${encodeURIComponent(topic)}`
    })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '催婚防御助手 - 优雅应对催婚问题',
      path: '/pages/index/index',
      imageUrl: ''
    }
  }
})
