// utils/util.js

/**
 * 格式化时间
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 格式化日期（只显示年月日）
 */
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${formatNumber(month)}-${formatNumber(day)}`
}

/**
 * 获取相对时间（如：刚刚、5分钟前）
 */
const getRelativeTime = timestamp => {
  const now = Date.now()
  const diff = now - timestamp
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`
  } else {
    return formatDate(new Date(timestamp))
  }
}

/**
 * 防抖函数
 */
const debounce = (func, wait) => {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

/**
 * 节流函数
 */
const throttle = (func, wait) => {
  let timeout
  return function(...args) {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(this, args)
      }, wait)
    }
  }
}

/**
 * 生成随机ID
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 检查是否为空
 */
const isEmpty = value => {
  return value === null || value === undefined || value === ''
}

/**
 * 显示Toast
 */
const showToast = (title, icon = 'none', duration = 2000) => {
  wx.showToast({
    title,
    icon,
    duration
  })
}

/**
 * 显示Loading
 */
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏Loading
 */
const hideLoading = () => {
  wx.hideLoading()
}

/**
 * 确认对话框
 */
const showConfirm = (content, title = '提示') => {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

/**
 * 复制到剪贴板
 */
const copyToClipboard = (data) => {
  return new Promise((resolve, reject) => {
    wx.setClipboardData({
      data,
      success: () => {
        showToast('已复制到剪贴板')
        resolve()
      },
      fail: reject
    })
  })
}

/**
 * 存储数据
 */
const setStorage = (key, data) => {
  try {
    wx.setStorageSync(key, data)
    return true
  } catch (e) {
    console.error('存储失败', e)
    return false
  }
}

/**
 * 获取存储数据
 */
const getStorage = (key) => {
  try {
    return wx.getStorageSync(key)
  } catch (e) {
    console.error('获取失败', e)
    return null
  }
}

/**
 * 删除存储数据
 */
const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (e) {
    console.error('删除失败', e)
    return false
  }
}

/**
 * 角色映射
 */
const roleMap = {
  parents: '父母',
  relatives: '亲戚',
  peers: '同辈',
  elders: '长辈'
}

/**
 * 问题类型映射
 */
const questionTypeMap = {
  when_married: '什么时候结婚',
  have_partner: '有对象了吗',
  when_back: '什么时候带回来',
  compare_others: '别人家孩子都...'
}

/**
 * 回应风格映射
 */
const styleMap = {
  gentle: '温和委婉',
  humor: '幽默自嘲',
  rational: '理性分析',
  counter: '反客为主',
  philosophy: '哲学金句'
}

module.exports = {
  formatTime,
  formatDate,
  getRelativeTime,
  debounce,
  throttle,
  generateId,
  isEmpty,
  showToast,
  showLoading,
  hideLoading,
  showConfirm,
  copyToClipboard,
  setStorage,
  getStorage,
  removeStorage,
  roleMap,
  questionTypeMap,
  styleMap
}
