// pages/community/community.js
const app = getApp()
const { getStorage, setStorage, showToast, getRelativeTime } = require('../../utils/util.js')

Page({
  data: {
    currentTab: 'recommend',
    posts: [],
    avatars: ['😎', '🌟', '🎭', '🎨', '🎸', '🎮', '🎲', '🎯'],
    names: ['小王', '小李', '小张', '路人甲', '匿名用户', '打工魂', '社畜', '自由人']
  },

  onLoad(options) {
    // 如果有topic参数，跳转到发帖页面
    if (options.topic) {
      this.createPostWithTopic(decodeURIComponent(options.topic))
      return
    }

    this.loadPosts()
  },

  onShow() {
    this.loadPosts()
  },

  // 切换Tab
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      currentTab: tab
    })
    this.loadPosts()
  },

  // 加载帖子列表
  loadPosts() {
    let posts = getStorage('communityPosts') || []

    // 模拟一些初始数据
    if (posts.length === 0) {
      posts = this.getMockPosts()
      setStorage('communityPosts', posts)
    }

    // 根据tab排序
    if (this.data.currentTab === 'hot') {
      posts.sort((a, b) => b.likeCount - a.likeCount)
    } else if (this.data.currentTab === 'latest') {
      posts.sort((a, b) => b.timestamp - a.timestamp)
    }

    this.setData({ posts })
  },

  // 获取模拟数据
  getMockPosts() {
    return [
      {
        id: 1,
        avatar: '😎',
        userName: '匿名用户',
        time: '2小时前',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        type: '吐槽',
        typeName: '吐槽',
        title: '今天被七大姑围攻了',
        content: '今天吃饭被七大姑围攻，什么"有对象没""什么时候结婚""隔壁小王二胎了"...我用了武器库的幽默自嘲话术，居然成功转移了话题！推荐大家试试！',
        commentCount: 23,
        likeCount: 56
      },
      {
        id: 2,
        avatar: '🌟',
        userName: '小李',
        time: '5小时前',
        timestamp: Date.now() - 5 * 60 * 60 * 1000,
        type: '经验',
        typeName: '经验',
        title: '分享我的沟通心得',
        content: '今年我跟父母进行了一次深度沟通，把我的想法和规划都说清楚了。其实父母催婚是因为担心和焦虑，当我们主动分享生活状态，他们反而没那么焦虑了。推荐大家试试"沟通桥梁"板块的模板。',
        commentCount: 45,
        likeCount: 89
      },
      {
        id: 3,
        avatar: '🎭',
        userName: '路人甲',
        time: '1天前',
        timestamp: Date.now() - 24 * 60 * 60 * 1000,
        type: '求助',
        typeName: '求助',
        title: '父母安排了相亲怎么破',
        content: '我妈偷偷给我安排了相亲，还不敢告诉我。今天突然说去见个朋友，结果到了现场是相亲...这种情况大家怎么处理？',
        commentCount: 67,
        likeCount: 34
      },
      {
        id: 4,
        avatar: '🎨',
        userName: '社畜',
        time: '2天前',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        type: '心情',
        typeName: '心情',
        title: '',
        content: '又一年过去了，还是单身。但我觉得单身也挺好的，自由自在，没有束缚。只是有时候看到别人一家三口逛街，心里还是会有一点点羡慕...',
        commentCount: 28,
        likeCount: 102
      }
    ]
  },

  // 查看帖子详情
  viewPost(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/community/detail?id=${id}`
    })
  },

  // 创建帖子
  createPost() {
    wx.navigateTo({
      url: '/pages/community/create'
    })
  },

  // 带话题创建帖子
  createPostWithTopic(topic) {
    wx.navigateTo({
      url: `/pages/community/create?topic=${encodeURIComponent(topic)}`
    })
  },

  // 分享帖子
  sharePost(e) {
    showToast('分享功能开发中')
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadPosts()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
