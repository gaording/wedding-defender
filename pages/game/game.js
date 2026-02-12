// pages/game/game.js
const app = getApp()
const { setStorage } = require('../../utils/util.js')

Page({
  data: {
    gameStarted: false,
    gameEnded: false,
    currentRound: 0,
    elegance: 50,
    atmosphere: 50,
    damage: 0,
    achievement: '',
    comment: '',
    currentScenario: null,

    // 游戏剧本
    scenarios: [
      {
        role: '七大姑',
        location: '春节饭桌',
        dialogue: '哎呀，小明今年都快30了，有没有对象啊？隔壁小王的孩子都打酱油了！',
        options: [
          {
            text: '姑，您看我这么优秀，国家还没给我分配呢！再说了，我现在老板就是我对象，天天"加班秀恩爱"。',
            hint: '幽默自嘲',
            effect: { elegance: 20, atmosphere: 15, damage: -5 }
          },
          {
            text: '关你什么事？管好你自己家孩子吧！',
            hint: '正面硬刚',
            effect: { elegance: -20, atmosphere: -30, damage: 30 }
          },
          {
            text: '姑您放心，有合适的我会考虑的。现在工作比较忙，想先把事业稳定下来。',
            hint: '温和回应',
            effect: { elegance: 10, atmosphere: 10, damage: 0 }
          }
        ]
      },
      {
        role: '妈妈',
        location: '家里客厅',
        dialogue: '儿啊，妈也不求你大富大贵，就希望你早点成家。妈这辈子最大的心愿就是看到你结婚生子...',
        options: [
          {
            text: '妈，我理解您的心意。但婚姻是一辈子的事，我想找个真正合适的人。您也不想我将来离婚吧？',
            hint: '真诚沟通',
            effect: { elegance: 15, atmosphere: 10, damage: -5 }
          },
          {
            text: '妈，您别说了行不行？烦不烦啊！',
            hint: '情绪爆发',
            effect: { elegance: -30, atmosphere: -40, damage: 40 }
          },
          {
            text: '（沉默不语，低头玩手机）',
            hint: '消极回避',
            effect: { elegance: -10, atmosphere: -10, damage: 10 }
          }
        ]
      },
      {
        role: '舅舅',
        location: '亲戚聚会',
        dialogue: '听说你还在租房？要是有个对象，两个人一起奋斗，也能早点买房啊！',
        options: [
          {
            text: '舅舅，现在房价这么高，我就是结了婚也买不起啊！再说了，单身租房也挺好，自由。',
            hint: '现实反击',
            effect: { elegance: 5, atmosphere: 5, damage: 15 }
          },
          {
            text: '哈哈，舅舅您说得对！不过我现在正在攒首付呢，房子和对象都会有的！',
            hint: '乐观积极',
            effect: { elegance: 15, atmosphere: 20, damage: -10 }
          },
          {
            text: '您家孩子买房了吗？现在年轻人压力都挺大的，互相理解吧。',
            hint: '转移话题',
            effect: { elegance: 10, atmosphere: 10, damage: 5 }
          }
        ]
      }
    ]
  },

  // 开始游戏
  startGame() {
    this.setData({
      gameStarted: true,
      gameEnded: false,
      currentRound: 0,
      elegance: 50,
      atmosphere: 50,
      damage: 0,
      currentScenario: this.data.scenarios[0]
    })
  },

  // 选择选项
  selectOption(e) {
    const index = e.currentTarget.dataset.index
    const option = this.data.currentScenario.options[index]
    const effect = option.effect

    // 更新数值
    let elegance = this.data.elegance + effect.elegance
    let atmosphere = this.data.atmosphere + effect.atmosphere
    let damage = this.data.damage + effect.damage

    // 限制范围
    elegance = Math.max(0, Math.min(100, elegance))
    atmosphere = Math.max(0, Math.min(100, atmosphere))
    damage = Math.max(0, Math.min(100, damage))

    this.setData({
      elegance,
      atmosphere,
      damage
    })

    // 下一轮或结束
    const nextRound = this.data.currentRound + 1
    if (nextRound >= this.data.scenarios.length) {
      this.endGame()
    } else {
      setTimeout(() => {
        this.setData({
          currentRound: nextRound,
          currentScenario: this.data.scenarios[nextRound]
        })
      }, 1000)
    }
  },

  // 结束游戏
  endGame() {
    const { elegance, atmosphere, damage } = this.data
    let achievement = ''
    let comment = ''

    // 评定成就
    if (elegance >= 70 && atmosphere >= 70 && damage <= 20) {
      achievement = '外交官'
      comment = '太厉害了！你用优雅和智慧化解了所有尴尬，真正做到了"不伤和气又守住底线"！'
    } else if (elegance >= 60 && atmosphere >= 60) {
      achievement = '沟通达人'
      comment = '做得不错！你的应对方式既体面又有效，继续保持！'
    } else if (damage >= 50) {
      achievement = '战士'
      comment = '你正面硬刚的勇气可嘉，但可能伤了家人的感情。试试更温和的方式？'
    } else if (atmosphere <= 30) {
      achievement = '冷战专家'
      comment = '场面一度非常尴尬...也许下次可以试试更积极的方式？'
    } else {
      achievement = '坚守者'
      comment = '你在努力应对，虽然结果不完美，但至少你在坚持自己的立场。'
    }

    this.setData({
      gameEnded: true,
      achievement,
      comment
    })

    // 记录成就
    if (achievement) {
      const titles = app.globalData.titles
      if (!titles.includes(achievement)) {
        app.globalData.titles.push(achievement)
        setStorage('titles', app.globalData.titles)
      }
    }
  },

  // 重新开始
  restartGame() {
    this.setData({
      gameStarted: false,
      gameEnded: false,
      currentRound: 0,
      elegance: 50,
      atmosphere: 50,
      damage: 0,
      achievement: '',
      comment: '',
      currentScenario: null
    })
  }
})
