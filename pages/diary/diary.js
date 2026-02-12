// pages/diary/diary.js
const app = getApp()
const { getStorage, setStorage, formatDate } = require('../../utils/util.js')

Page({
  data: {
    diaries: []
  },

  onLoad() {
    this.loadDiaries()
  },

  onShow() {
    this.loadDiaries()
  },

  // 加载日记列表
  loadDiaries() {
    const diaries = getStorage('diaries') || []
    this.setData({ diaries })
  },

  // 查看日记详情
  viewDiary(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/diary/detail?id=${id}`
    })
  },

  // 添加日记
  addDiary() {
    wx.navigateTo({
      url: '/pages/diary/edit'
    })
  }
})
