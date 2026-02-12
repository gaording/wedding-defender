// 全局应用状态
const app = {
  data: {
    defenseCount: 0,
    diaryCount: 0,
    postCount: 0,
    titles: [],
    userLevel: 1
  },

  // 加载数据
  loadData() {
    const saved = storage.get('appData');
    if (saved) {
      this.data = { ...this.data, ...saved };
    }
    this.saveData();
  },

  // 保存数据
  saveData() {
    storage.set('appData', this.data);
  },

  // 添加应对次数
  addDefense() {
    this.data.defenseCount++;
    this.updateLevel();
    this.checkAchievements();
    this.saveData();
    updateStatsDisplay();
  },

  // 添加日记数
  addDiary() {
    this.data.diaryCount++;
    this.updateLevel();
    this.checkAchievements();
    this.saveData();
    updateStatsDisplay();
  },

  // 添加帖子数
  addPost() {
    this.data.postCount++;
    this.updateLevel();
    this.checkAchievements();
    this.saveData();
    updateStatsDisplay();
  },

  // 更新等级
  updateLevel() {
    const totalScore = this.data.defenseCount * 10 +
                       this.data.diaryCount * 5 +
                       this.data.postCount * 3;

    let level = 1;
    if (totalScore >= 100) level = 5;
    else if (totalScore >= 50) level = 4;
    else if (totalScore >= 20) level = 3;
    else if (totalScore >= 10) level = 2;

    this.data.userLevel = level;

    // 更新显示
    const levelEl = document.getElementById('userLevel');
    if (levelEl) levelEl.textContent = level;
  },

  // 检查成就
  checkAchievements() {
    const newTitles = [];

    if (this.data.defenseCount >= 10 && !this.data.titles.includes('太极拳宗师')) {
      newTitles.push('太极拳宗师');
    }
    if (this.data.defenseCount >= 30 && !this.data.titles.includes('坚守者')) {
      newTitles.push('坚守者');
    }
    if (this.data.diaryCount >= 5 && !this.data.titles.includes('记录者')) {
      newTitles.push('记录者');
    }
    if (this.data.postCount >= 3 && !this.data.titles.includes('社区活跃者')) {
      newTitles.push('社区活跃者');
    }

    if (newTitles.length > 0) {
      this.data.titles = [...this.data.titles, ...newTitles];
      showToast(`🏆 解锁称号：${newTitles.join('、')}`);
      updateTitlesDisplay();
    }
  },

  // 添加称号
  addTitle(title) {
    if (!this.data.titles.includes(title)) {
      this.data.titles.push(title);
      this.saveData();
      updateTitlesDisplay();
    }
  }
};

// 话术生成器状态
const generator = {
  selectedRole: null,
  selectedQuestionType: null,
  selectedStyle: null,
  currentScript: null,
  favorites: [],

  // 选择标签
  selectTag(type, value, element) {
    // 更新状态
    if (type === 'role') this.selectedRole = value;
    if (type === 'question') this.selectedQuestionType = value;
    if (type === 'style') this.selectedStyle = value;

    // 更新UI
    const container = element.parentElement;
    container.querySelectorAll('.tag-btn').forEach(btn => {
      btn.classList.remove('selected');
    });
    element.classList.add('selected');

    // 检查是否可以生成
    this.checkCanGenerate();
  },

  // 检查是否可以生成
  checkCanGenerate() {
    const btn = document.getElementById('generateBtn');
    if (btn) {
      btn.disabled = !(this.selectedRole && this.selectedQuestionType && this.selectedStyle);
    }
  },

  // 生成话术
  generate() {
    const script = scriptsData.getRandomScript(
      this.selectedRole,
      this.selectedQuestionType,
      this.selectedStyle
    );

    if (!script) {
      showToast('暂时没有合适的话术');
      return;
    }

    this.currentScript = script;
    this.displayResult();
    this.addToFavorites(script);
  },

  // 显示结果
  displayResult() {
    const resultCard = document.getElementById('resultCard');
    const resultScript = document.getElementById('resultScript');
    const resultUsage = document.getElementById('resultUsage');

    if (resultCard) resultCard.style.display = 'block';
    if (resultScript) resultScript.textContent = this.currentScript.script;
    if (resultUsage) resultUsage.textContent = `💡 ${this.currentScript.usage}`;
  },

  // 添加到收藏
  addToFavorites(script) {
    const favorite = {
      id: generateId(),
      script: script.script,
      time: formatDate(new Date()),
      timestamp: Date.now()
    };

    this.favorites.unshift(favorite);
    if (this.favorites.length > 10) this.favorites.pop();

    storage.set('favoriteScripts', this.favorites);
    this.displayFavorites();
  },

  // 显示收藏
  displayFavorites() {
    const section = document.getElementById('favoriteSection');
    const list = document.getElementById('favoriteList');

    if (this.favorites.length === 0) {
      if (section) section.style.display = 'none';
      return;
    }

    if (section) section.style.display = 'block';
    if (list) {
      list.innerHTML = this.favorites.map(item => `
        <div class="favorite-item" onclick="generator.useFavorite('${item.id}')">
          <div class="favorite-text">${item.script}</div>
          <div class="favorite-time">${item.time}</div>
        </div>
      `).join('');
    }
  },

  // 使用收藏
  useFavorite(id) {
    const item = this.favorites.find(f => f.id === id);
    if (item) {
      this.currentScript = {
        script: item.script,
        usage: ''
      };
      this.displayResult();

      // 滚动到结果
      document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },

  // 加载收藏
  loadFavorites() {
    this.favorites = storage.get('favoriteScripts', []);
    this.displayFavorites();
  }
};

// 游戏状态
const game = {
  started: false,
  currentRound: 0,
  elegance: 50,
  atmosphere: 50,
  damage: 0,

  // 开始游戏
  start() {
    this.started = true;
    this.currentRound = 0;
    this.elegance = 50;
    this.atmosphere = 50;
    this.damage = 0;
    this.showScenario();
  },

  // 显示场景
  showScenario() {
    const scenario = gameScenarios[this.currentRound];
    const content = document.getElementById('modalContent');

    content.innerHTML = `
      <div class="game-header">
        <h3>🎭 催婚剧本杀</h3>
        <p>第 ${this.currentRound + 1} / ${gameScenarios.length} 轮</p>
      </div>
      <div class="game-stats">
        <div class="stat-row">
          <span class="stat-name">优雅度</span>
          <div class="stat-bar-container">
            <div class="stat-bar-fill" style="width: ${this.elegance}%; background: #667eea;"></div>
          </div>
          <span class="stat-value">${this.elegance}</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">气氛值</span>
          <div class="stat-bar-container">
            <div class="stat-bar-fill" style="width: ${this.atmosphere}%; background: #10b981;"></div>
          </div>
          <span class="stat-value">${this.atmosphere}</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">杀伤力</span>
          <div class="stat-bar-container">
            <div class="stat-bar-fill" style="width: ${this.damage}%; background: #ef4444;"></div>
          </div>
          <span class="stat-value">${this.damage}</span>
        </div>
      </div>
      <div class="scenario-card">
        <div class="scenario-header">
          <span class="scenario-role">${scenario.role}</span>
          <span class="scenario-role">${scenario.location}</span>
        </div>
        <p class="scenario-text">${scenario.dialogue}</p>
      </div>
      <div class="options-list">
        ${scenario.options.map((opt, i) => `
          <div class="option-card" onclick="game.selectOption(${i})">
            <div class="option-text">${opt.text}</div>
            <div class="option-hint">${opt.hint}</div>
          </div>
        `).join('')}
      </div>
    `;

    openModal();
  },

  // 选择选项
  selectOption(index) {
    const scenario = gameScenarios[this.currentRound];
    const effect = scenario.options[index].effect;

    // 更新数值
    this.elegance = Math.max(0, Math.min(100, this.elegance + effect.elegance));
    this.atmosphere = Math.max(0, Math.min(100, this.atmosphere + effect.atmosphere));
    this.damage = Math.max(0, Math.min(100, this.damage + effect.damage));

    // 下一轮或结束
    this.currentRound++;
    if (this.currentRound >= gameScenarios.length) {
      this.endGame();
    } else {
      this.showScenario();
    }
  },

  // 结束游戏
  endGame() {
    let achievement = '';
    let comment = '';

    if (this.elegance >= 70 && this.atmosphere >= 70 && this.damage <= 20) {
      achievement = '外交官';
      comment = '太厉害了！你用优雅和智慧化解了所有尴尬，真正做到了"不伤和气又守住底线"！';
    } else if (this.elegance >= 60 && this.atmosphere >= 60) {
      achievement = '沟通达人';
      comment = '做得不错！你的应对方式既体面又有效，继续保持！';
    } else if (this.damage >= 50) {
      achievement = '战士';
      comment = '你正面硬刚的勇气可嘉，但可能伤了家人的感情。试试更温和的方式？';
    } else if (this.atmosphere <= 30) {
      achievement = '冷战专家';
      comment = '场面一度非常尴尬...也许下次可以试试更积极的方式？';
    } else {
      achievement = '坚守者';
      comment = '你在努力应对，虽然结果不完美，但至少你在坚持自己的立场。';
    }

    const content = document.getElementById('modalContent');
    content.innerHTML = `
      <div style="text-align: center;">
        <h2 style="font-size: 24px; margin-bottom: 20px;">🎉 游戏结束</h2>
        <div style="margin-bottom: 20px;">
          <div style="margin-bottom: 10px;">优雅度: <strong>${this.elegance}</strong></div>
          <div style="margin-bottom: 10px;">气氛值: <strong>${this.atmosphere}</strong></div>
          <div>杀伤力: <strong>${this.damage}</strong></div>
        </div>
        ${achievement ? `<p style="color: #f59e0b; font-size: 18px; margin-bottom: 15px;">🏆 解锁称号：${achievement}</p>` : ''}
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">${comment}</p>
        <button class="btn-primary" onclick="game.restart(); showModal('game');">再玩一次</button>
        <button class="btn-secondary" style="margin-top: 10px;" onclick="closeModal()">关闭</button>
      </div>
    `;

    // 添加称号
    if (achievement) {
      app.addTitle(achievement);
    }
  },

  // 重置
  restart() {
    this.started = false;
    this.currentRound = 0;
    this.elegance = 50;
    this.atmosphere = 50;
    this.damage = 0;
  }
};

// 页面导航
function navigateTo(page) {
  // 隐藏所有页面
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // 显示目标页面
  const targetPage = document.getElementById(`page-${page}`);
  const targetNav = document.querySelector(`.nav-item[data-page="${page}"]`);

  if (targetPage) targetPage.classList.add('active');
  if (targetNav) targetNav.classList.add('active');

  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 显示弹窗
function showModal(type) {
  const modal = document.getElementById('modal');
  const content = document.getElementById('modalContent');

  let html = '';

  switch(type) {
    case 'diary':
      html = `
        <h3 class="modal-title">📝 写催婚日记</h3>
        <div class="form-group">
          <label class="form-label">遇到了什么问题</label>
          <input class="form-input" id="diaryQuestion" type="text" placeholder="比如：妈妈问什么时候结婚">
        </div>
        <div class="form-group">
          <label class="form-label">你是如何应对的</label>
          <textarea class="form-textarea" id="diaryResponse" placeholder="写下你的应对方式..."></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">现在的心情</label>
          <select class="form-select" id="diaryMood">
            <option value="😊 平静">😊 平静</option>
            <option value="😌 释然">😌 释然</option>
            <option value="😤 烦躁">😤 烦躁</option>
            <option value="😢 委屈">😢 委屈</option>
            <option value="😡 愤怒">😡 愤怒</option>
          </select>
        </div>
        <button class="btn-primary" onclick="saveDiary()">保存日记</button>
        <button class="btn-secondary" style="margin-top: 10px;" onclick="closeModal()">取消</button>
      `;
      break;

    case 'post':
      html = `
        <h3 class="modal-title">🌳 发布到树洞</h3>
        <div class="form-group">
          <label class="form-label">类型</label>
          <select class="form-select" id="postType">
            <option value="吐槽">😤 吐槽</option>
            <option value="求助">🆘 求助</option>
            <option value="经验">💡 经验</option>
            <option value="心情">💭 心情</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">标题（可选）</label>
          <input class="form-input" id="postTitle" type="text" placeholder="简短描述...">
        </div>
        <div class="form-group">
          <label class="form-label">内容</label>
          <textarea class="form-textarea" id="postContent" placeholder="分享你的故事..."></textarea>
        </div>
        <button class="btn-primary" onclick="savePost()">发布</button>
        <button class="btn-secondary" style="margin-top: 10px;" onclick="closeModal()">取消</button>
      `;
      break;

    case 'game':
      if (!game.started) {
        html = `
          <div style="text-align: center;">
            <h3>🎭 催婚剧本杀</h3>
            <p style="color: #666; margin: 20px 0;">在游戏中练习应对技巧，轻松get防御技能</p>
            <div style="text-align: left; background: #f5f7fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="font-size: 13px; margin-bottom: 8px;">1. 系统会随机生成催婚场景</p>
              <p style="font-size: 13px; margin-bottom: 8px;">2. 选择你的应对方式</p>
              <p style="font-size: 13px; margin-bottom: 8px;">3. 系统会评估你的优雅度、气氛值和杀伤力</p>
              <p style="font-size: 13px;">4. 目标：保持高优雅度和气氛值，降低杀伤力</p>
            </div>
            <button class="btn-primary" onclick="game.start();">开始游戏</button>
            <button class="btn-secondary" style="margin-top: 10px;" onclick="closeModal()">关闭</button>
          </div>
        `;
      } else {
        game.showScenario();
        return;
      }
      break;

    case 'guide':
      html = `
        <h3 class="modal-title">🌉 沟通指南</h3>
        <div style="max-height: 60vh; overflow-y: auto;">
          <h4 style="margin: 15px 0 10px;">理解父母的焦虑</h4>
          <p style="font-size: 13px; color: #666; line-height: 1.8;">父母催婚通常源于担心和焦虑，担心我们老了孤独，担心自己看不到孙辈。理解他们的出发点，有助于我们更好地沟通。</p>

          <h4 style="margin: 15px 0 10px;">有效沟通的原则</h4>
          <ul style="font-size: 13px; color: #666; line-height: 1.8; padding-left: 20px;">
            <li>先肯定对方的关心，再表达自己的立场</li>
            <li>避免在情绪激动时沟通</li>
            <li>选择合适的时间和场景</li>
            <li>多用"我"陈述，少用"你"指责</li>
          </ul>

          <h4 style="margin: 15px 0 10px;">如何设置边界</h4>
          <p style="font-size: 13px; color: #666; line-height: 1.8;">礼貌但坚定地表明你的底线。比如："妈，我知道您关心我，但我希望您能尊重我的节奏。"</p>

          <h4 style="margin: 15px 0 10px;">何时该妥协</h4>
          <p style="font-size: 13px; color: #666; line-height: 1.8;">可以妥协：见见他们介绍的人（不带压力）。不该妥协：违背自己意愿的婚姻决定。</p>
        </div>
        <button class="btn-primary" style="margin-top: 20px;" onclick="closeModal()">关闭</button>
      `;
      break;
  }

  if (content) content.innerHTML = html;
  if (modal) modal.style.display = 'flex';
}

// 关闭弹窗
function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.style.display = 'none';
}

// 保存日记
function saveDiary() {
  const question = document.getElementById('diaryQuestion').value.trim();
  const response = document.getElementById('diaryResponse').value.trim();
  const mood = document.getElementById('diaryMood').value;

  if (!question || !response) {
    showToast('请填写完整');
    return;
  }

  const diaries = storage.get('diaries', []);
  diaries.unshift({
    id: generateId(),
    date: formatDate(new Date()),
    question,
    response,
    mood,
    timestamp: Date.now()
  });

  storage.set('diaries', diaries);
  app.addDiary();
  showToast('日记已保存');
  closeModal();
}

// 保存帖子
function savePost() {
  const type = document.getElementById('postType').value;
  const title = document.getElementById('postTitle').value.trim();
  const content = document.getElementById('postContent').value.trim();

  if (!content) {
    showToast('请填写内容');
    return;
  }

  const posts = storage.get('userPosts', []);
  posts.unshift({
    id: generateId(),
    avatar: ['😎', '🌟', '🎭', '🎨', '🎸', '🎮', '🎲', '🎯'][Math.floor(Math.random() * 8)],
    userName: '我',
    time: '刚刚',
    type,
    title,
    content,
    commentCount: 0,
    likeCount: 0,
    timestamp: Date.now()
  });

  storage.set('userPosts', posts);
  app.addPost();
  showToast('发布成功');
  closeModal();
  renderPosts();
}

// 渲染帖子列表
function renderPosts() {
  const mockPostsList = mockPosts;
  const userPosts = storage.get('userPosts', []);
  const allPosts = [...userPosts, ...mockPostsList];

  const container = document.getElementById('postsList');
  if (!container) return;

  container.innerHTML = allPosts.map(post => `
    <div class="post-card">
      <div class="post-header">
        <div class="post-user-info">
          <div class="post-avatar">${post.avatar}</div>
          <div>
            <span class="post-name">${post.userName}</span>
            <span class="post-time">${post.time}</span>
          </div>
        </div>
        <span class="post-tag ${post.type}">${post.type}</span>
      </div>
      <div class="post-content">
        ${post.title ? `<span class="post-title">${post.title}</span>` : ''}
        <span class="post-text">${post.content}</span>
      </div>
      <div class="post-stats">
        <span>💬 ${post.commentCount}</span>
        <span>❤️ ${post.likeCount}</span>
      </div>
    </div>
  `).join('');
}

// 渲染数据卡片
function renderDataCards() {
  const container = document.getElementById('dataCards');
  if (!container) return;

  container.innerHTML = dataCards.map(card => `
    <div class="data-card" onclick="showToast('${card.description}')">
      <div class="data-title">${card.title}</div>
      <div class="data-desc">${card.description}</div>
      <span class="data-tag">${card.category}</span>
    </div>
  `).join('');
}

// 更新统计显示
function updateStatsDisplay() {
  const defenseEl = document.getElementById('defenseCount');
  const diaryEl = document.getElementById('diaryCount');
  const postEl = document.getElementById('postCount');

  if (defenseEl) defenseEl.textContent = app.data.defenseCount;
  if (diaryEl) diaryEl.textContent = app.data.diaryCount;
  if (postEl) postEl.textContent = app.data.postCount;
}

// 更新称号显示
function updateTitlesDisplay() {
  const titles = app.data.titles;

  // 首页称号
  const homeCard = document.getElementById('titlesCard');
  const homeList = document.getElementById('titlesList');

  if (titles.length > 0 && homeCard && homeList) {
    homeCard.style.display = 'block';
    homeList.innerHTML = titles.map(title =>
      `<span class="title-tag">${title}</span>`
    ).join('');
  }

  // 个人中心称号
  const profileSection = document.getElementById('profileTitles');
  const profileList = document.getElementById('profileTitlesList');

  if (titles.length > 0 && profileSection && profileList) {
    profileSection.style.display = 'block';
    profileList.innerHTML = titles.map(title =>
      `<span class="title-tag">${title}</span>`
    ).join('');
  }
}

// 生成每日buff
function generateDailyBuff() {
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
  ];

  const today = new Date().getDate();
  const buffDesc = document.getElementById('buffDesc');
  if (buffDesc) buffDesc.textContent = buffs[today % buffs.length];
}

// 生成每日一句
function generateDailyQuote() {
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
  ];

  const today = new Date().getDate();
  const quote = quotes[today % quotes.length];

  const quoteText = document.getElementById('dailyQuote');
  const quoteAuthor = document.getElementById('quoteAuthor');

  if (quoteText) quoteText.textContent = quote.text;
  if (quoteAuthor) {
    quoteAuthor.textContent = quote.author ? `—— ${quote.author}` : '';
    quoteAuthor.style.display = quote.author ? 'block' : 'none';
  }
}

// 复制话术
function copyScript() {
  if (generator.currentScript) {
    copyToClipboard(generator.currentScript.script);
  }
}

// 记录应对
function recordDefense() {
  app.addDefense();
  showToast('已记录！继续加油！');
}

// 初始化
function init() {
  // 加载数据
  app.loadData();
  generator.loadFavorites();

  // 更新显示
  updateStatsDisplay();
  updateTitlesDisplay();
  generateDailyBuff();
  generateDailyQuote();
  renderPosts();
  renderDataCards();

  // 导航事件
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.currentTarget.dataset.page;
      navigateTo(page);
    });
  });

  // 标签选择事件
  document.querySelectorAll('#roleTags .tag-btn').forEach(btn => {
    btn.addEventListener('click', () => generator.selectTag('role', btn.dataset.value, btn));
  });

  document.querySelectorAll('#questionTags .tag-btn').forEach(btn => {
    btn.addEventListener('click', () => generator.selectTag('question', btn.dataset.value, btn));
  });

  document.querySelectorAll('#styleTags .tag-btn').forEach(btn => {
    btn.addEventListener('click', () => generator.selectTag('style', btn.dataset.value, btn));
  });

  // 生成按钮事件
  const generateBtn = document.getElementById('generateBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', () => generator.generate());
  }

  // 每日buff点击事件
  const dailyBuff = document.getElementById('dailyBuff');
  if (dailyBuff) {
    dailyBuff.addEventListener('click', () => {
      showToast('今日运势已生效');
    });
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
