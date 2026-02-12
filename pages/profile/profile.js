// pages/profile/profile.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    userLevel: 1,
    achievements: {
      defenseCount: 0,
      diaryCount: 0,
      communityPosts: 0,
      loginDays: 0
    },
    titles: []
  },

  onLoad() {
    // 获取用户信息
    this.getUserInfo()
    this.loadUserData()
  },

  onShow() {
    this.loadUserData()
  },

  // 获取用户信息
  getUserInfo() {
    const userInfo = app.globalData.userInfo || {}
    this.setData({ userInfo })
  },

  // 加载用户数据
  loadUserData() {
    const achievements = app.globalData.achievements
    const titles = app.globalData.titles

    // 计算等级
    let level = 1
    const totalScore = achievements.defenseCount * 10 +
                       achievements.diaryCount * 5 +
                       achievements.communityPosts * 3

    if (totalScore >= 100) level = 5
    else if (totalScore >= 50) level = 4
    else if (totalScore >= 20) level = 3
    else if (totalScore >= 10) level = 2

    this.setData({
      achievements,
      titles,
      userLevel: level
    })
  },

  // 跳转日记
  goToDiary() {
    wx.navigateTo({
      url: '/pages/diary/diary'
    })
  },

  // 跳转沟通指南
  goToBridge() {
    wx.navigateTo({
      url: '/pages/bridge/bridge'
    })
  },

  // 跳转游戏
  goToGame() {
    wx.navigateTo({
      url: '/pages/game/game'
    })
  },

  // 分享
  shareApp() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  // 分享配置
  onShareAppMessage() {
    return {
      title: '催婚防御助手 - 优雅应对催婚问题',
      path: '/pages/index/index',
      imageUrl: ''
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '催婚防御助手 - 优雅应对催婚问题',
      imageUrl: ''
    }
  }
})
