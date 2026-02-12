// pages/arsenal/arsenal.js
const app = getApp()
const scriptsData = require('../../data/scripts.js')
const { copyToClipboard, getStorage, setStorage, showToast, formatDate } = require('../../utils/util.js')

Page({
  data: {
    currentTab: 'script',

    // 选择器选项
    selectedRole: '',
    selectedQuestionType: '',
    selectedStyle: '',

    roleOptions: [
      { label: '👨‍👩‍👧 父母', value: 'parents' },
      { label: '👵 亲戚', value: 'relatives' },
      { label: '👥 同辈', value: 'peers' },
      { label: '👴 长辈', value: 'elders' }
    ],

    questionTypeOptions: [
      { label: '💍 什么时候结婚', value: 'when_married' },
      { label: '💑 有对象了吗', value: 'have_partner' },
      { label: '🏠 什么时候带回来', value: 'when_back' },
      { label: '👶 别人家孩子...', value: 'compare_others' }
    ],

    styleOptions: [
      { label: '🌸 温和委婉', value: 'gentle' },
      { label: '😄 幽默自嘲', value: 'humor' },
      { label: '🧠 理性分析', value: 'rational' },
      { label: '↩️ 反客为主', value: 'counter' },
      { label: '📖 哲学金句', value: 'philosophy' }
    ],

    // 生成结果
    generatedScript: null,
    canGenerate: false,

    // 收藏
    favoriteScripts: [],

    // 表情包（示例）
    emojiList: [
      'https://via.placeholder.com/300x300/f093fb/ffffff?text=暂无表情',
      'https://via.placeholder.com/300x300/667eea/ffffff?text=暂无表情',
      'https://via.placeholder.com/300x300/764ba2/ffffff?text=暂无表情',
      'https://via.placeholder.com/300x300/f5576c/ffffff?text=暂无表情'
    ],

    // 数据反击卡片
    dataCards: [
      {
        id: 1,
        title: '晚婚离婚率更低',
        description: '数据显示，晚婚人群的离婚率显著低于早婚人群，成熟的选择更有保障。',
        category: '婚姻数据'
      },
      {
        id: 2,
        title: '一线城市平均相亲17次',
        description: '2023年数据显示，一线城市平均需要相亲17次才能成功，你要有耐心。',
        category: '相亲数据'
      },
      {
        id: 3,
        title: '50%以上的人晚婚',
        description: '现在的晚婚率已超过50%，你很正常，不正常的是还在用旧标准衡量你的人。',
        category: '社会趋势'
      },
      {
        id: 4,
        title: '单身经济正在崛起',
        description: '单身人群的消费能力和生活质量都在提升，单身≠失败。',
        category: '生活方式'
      },
      {
        id: 5,
        title: '逼婚导致的悲剧',
        description: '因父母逼婚导致的抑郁症、冲动婚姻和离婚案例不在少数，何必呢？',
        category: '警示案例'
      },
      {
        id: 6,
        title: '养育成本超百万',
        description: '一线城市养大一个孩子的成本超过100万，你这是在给父母省钱。',
        category: '经济分析'
      }
    ]
  },

  onLoad() {
    this.loadFavorites()
  },

  // 切换Tab
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      currentTab: tab
    })
  },

  // 选择角色
  selectRole(e) {
    this.setData({
      selectedRole: e.currentTarget.dataset.value
    })
    this.checkCanGenerate()
  },

  // 选择问题类型
  selectQuestionType(e) {
    this.setData({
      selectedQuestionType: e.currentTarget.dataset.value
    })
    this.checkCanGenerate()
  },

  // 选择风格
  selectStyle(e) {
    this.setData({
      selectedStyle: e.currentTarget.dataset.value
    })
    this.checkCanGenerate()
  },

  // 检查是否可以生成
  checkCanGenerate() {
    const { selectedRole, selectedQuestionType, selectedStyle } = this.data
    const canGenerate = selectedRole && selectedQuestionType && selectedStyle
    this.setData({ canGenerate })
  },

  // 生成话术
  generateScript() {
    const { selectedRole, selectedQuestionType, selectedStyle } = this.data
    const script = scriptsData.getRandomScript(selectedRole, selectedQuestionType, selectedStyle)

    if (!script) {
      showToast('暂时没有合适的话术')
      return
    }

    this.setData({
      generatedScript: script
    })

    // 自动收藏
    this.addToFavorites(script)
  },

  // 换一条
  regenerateScript() {
    this.generateScript()
  },

  // 复制话术
  copyScript() {
    const { generatedScript } = this.data
    if (generatedScript) {
      copyToClipboard(generatedScript.script)
    }
  },

  // 添加到收藏
  addToFavorites(script) {
    const favorite = {
      id: Date.now(),
      script: script.script,
      time: formatDate(new Date()),
      timestamp: Date.now()
    }

    const favorites = [...this.data.favoriteScripts]
    favorites.unshift(favorite)

    // 只保留最近10条
    if (favorites.length > 10) {
      favorites.pop()
    }

    this.setData({
      favoriteScripts: favorites
    })

    setStorage('favoriteScripts', favorites)
  },

  // 加载收藏
  loadFavorites() {
    const favorites = getStorage('favoriteScripts') || []
    this.setData({
      favoriteScripts: favorites
    })
  },

  // 使用收藏
  useFavorite(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      generatedScript: {
        script: item.script,
        usage: ''
      }
    })
  },

  // 记录一次成功应对
  recordUse() {
    app.addDefenseCount()
    showToast('已记录！继续加油！')

    // 刷新数据
    this.setData({
      achievements: app.globalData.achievements
    })
  },

  // 预览表情包
  previewEmoji(e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [url],
      current: url
    })
  },

  // 查看数据卡片
  viewDataCard(e) {
    const item = e.currentTarget.dataset.item
    wx.showModal({
      title: item.title,
      content: item.description,
      showCancel: false,
      confirmText: '知道了'
    })
  }
})
