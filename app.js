// app.js
App({
  globalData: {
    userInfo: null,
    hasLogin: false,
    // 用户成就数据
    achievements: {
      defenseCount: 0,        // 成功应对次数
      diaryCount: 0,          // 日记数量
      communityPosts: 0,       // 社区帖子数
      loginDays: 0            // 连续登录天数
    },
    // 用户称号
    titles: []
  },

  onLaunch() {
    // 小程序启动
    console.log('催婚防御助手启动')

    // 检查登录状态
    this.checkLoginStatus()

    // 获取本地存储的数据
    this.loadLocalData()
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
      this.globalData.hasLogin = true
    }
  },

  // 加载本地数据
  loadLocalData() {
    const achievements = wx.getStorageSync('achievements')
    if (achievements) {
      this.globalData.achievements = achievements
    }

    const titles = wx.getStorageSync('titles')
    if (titles) {
      this.globalData.titles = titles
    }
  },

  // 保存数据到本地
  saveData(key, data) {
    try {
      wx.setStorageSync(key, data)
      if (key === 'achievements') {
        this.globalData.achievements = data
      } else if (key === 'titles') {
        this.globalData.titles = data
      } else if (key === 'userInfo') {
        this.globalData.userInfo = data
      }
    } catch (e) {
      console.error('保存数据失败', e)
    }
  },

  // 记录应对次数
  addDefenseCount() {
    this.globalData.achievements.defenseCount++
    this.saveData('achievements', this.globalData.achievements)
    this.checkAndUnlockAchievement()
  },

  // 检查并解锁成就
  checkAndUnlockAchievement() {
    const { defenseCount, diaryCount, communityPosts } = this.globalData.achievements
    const newTitles = []

    // 太极拳宗师：成功应对10次
    if (defenseCount >= 10 && !this.hasTitle('太极拳宗师')) {
      newTitles.push('太极拳宗师')
    }

    // 坚守者：连续应对30次
    if (defenseCount >= 30 && !this.hasTitle('坚守者')) {
      newTitles.push('坚守者')
    }

    // 记录者：写满5篇日记
    if (diaryCount >= 5 && !this.hasTitle('记录者')) {
      newTitles.push('记录者')
    }

    // 社区活跃者：发3个帖子
    if (communityPosts >= 3 && !this.hasTitle('社区活跃者')) {
      newTitles.push('社区活跃者')
    }

    if (newTitles.length > 0) {
      this.globalData.titles = [...this.globalData.titles, ...newTitles]
      this.saveData('titles', this.globalData.titles)
      return newTitles
    }

    return []
  },

  // 检查是否已有称号
  hasTitle(title) {
    return this.globalData.titles.includes(title)
  }
})
