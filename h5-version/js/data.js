// 话术库数据
const scriptsData = {
  scripts: [
    // ===== 父母 - 什么时候结婚 =====
    {
      role: 'parents',
      questionType: 'when_married',
      style: 'gentle',
      script: '爸妈，我知道你们着急，但婚姻是一辈子的事，我想找一个真正合适的人，不想为了结婚而结婚。你们也不想我将来离婚吧？',
      usage: '温和表达，强调婚姻质量'
    },
    {
      role: 'parents',
      questionType: 'when_married',
      style: 'humor',
      script: '妈，您看我这颜值和才华，那得找个配得上我的呀！这不得慢慢挑？再说了，我现在老板就是我对象，天天加班，挺"恩爱"的。',
      usage: '幽默化解，转移话题'
    },
    {
      role: 'parents',
      questionType: 'when_married',
      style: 'rational',
      script: '现在的晚婚率已经超过50%了，我这很正常。而且调查显示，晚婚的人离婚率更低。我想等自己经济和心理都准备好了再结婚，这是对对方负责，也是对未来的孩子负责。',
      usage: '用数据和理性分析说服'
    },
    {
      role: 'parents',
      questionType: 'when_married',
      style: 'counter',
      script: '其实我更想问问你们，你们觉得我幸福重要还是结婚重要？如果我结婚但不幸福，你们会开心吗？',
      usage: '反问，让对方思考'
    },
    {
      role: 'parents',
      questionType: 'when_married',
      style: 'philosophy',
      script: '村上春树说："在这个世界上，每个人都有一块属于自己的领地。" 我的领地还在等待那个对的人。快不得，急不得。',
      usage: '用名言金句提升格调'
    },

    // ===== 亲戚 - 有对象吗 =====
    {
      role: 'relatives',
      questionType: 'have_partner',
      style: 'gentle',
      script: '姑您放心，有合适的我会带回来的。现在工作比较忙，我想先把事业稳定下来，再考虑感情的事。',
      usage: '礼貌回应，感谢关心'
    },
    {
      role: 'relatives',
      questionType: 'have_partner',
      style: 'humor',
      script: '姑，您看我这样子，像是能藏得住对象的人吗？再说了，现在优秀的人都比较独立，我在等那个能和我一起优秀的人。',
      usage: '自嘲式幽默'
    },
    {
      role: 'relatives',
      questionType: 'have_partner',
      style: 'rational',
      script: '现在年轻人结婚年龄普遍推迟了，我身边很多朋友都三十多才结婚。我觉得什么时候结婚不重要，重要的是嫁给/娶到对的人。',
      usage: '理性分析社会现象'
    },
    {
      role: 'relatives',
      questionType: 'have_partner',
      style: 'counter',
      script: '姑，您家孩子今年期末考多少分呀？现在孩子学习压力大，得抓紧啊。对了，您退休金涨了吗？',
      usage: '转移话题，反问关心'
    },
    {
      role: 'relatives',
      questionType: 'have_partner',
      style: 'philosophy',
      script: '三毛说："如果你给我的，和你给别人的是一样的，那我就不要了。" 婚姻也是这样，我不想凑合。',
      usage: '引用名言'
    },

    // ===== 亲戚 - 隔壁小王都二胎了 =====
    {
      role: 'relatives',
      questionType: 'compare_others',
      style: 'gentle',
      script: '是呀，小王挺好的。不过每个人的节奏不一样，我也有自己的规划。我相信按照自己的步伐来，会找到属于我的幸福。',
      usage: '肯定他人，坚持自己'
    },
    {
      role: 'relatives',
      questionType: 'compare_others',
      style: 'humor',
      script: '哎呀，小王是人生赢家啊！不过您看，小王胖了那么多，我这是在保持身材，为将来做准备呢。再说了，二胎是国家鼓励的，我又不是不给国家做贡献，我只是晚点做。',
      usage: '自嘲+幽默'
    },
    {
      role: 'relatives',
      questionType: 'compare_others',
      style: 'rational',
      script: '每个人的生活轨迹都不一样。小王选择早婚早育，这挺好的。但我也有自己的人生规划。调查显示，晚婚晚育的人在教育和经济准备上更充分，对孩子也更好。',
      usage: '理性对比'
    },
    {
      role: 'relatives',
      questionType: 'compare_others',
      style: 'counter',
      script: '那您倒是说说，小王结婚您出了多少钱？这年头养个孩子成本多高啊。我这是在给您省钱呢！',
      usage: '反问+现实考量'
    },
    {
      role: 'relatives',
      questionType: 'compare_others',
      style: 'philosophy',
      script: '米兰昆德拉说："生活是瞬间的集合，不是某种既定的轨道。" 我不想活在别人的时间表里，我想活出自己的节奏。',
      usage: '哲学式回应'
    },

    // ===== 父母 - 什么时候带对象回来 =====
    {
      role: 'parents',
      questionType: 'when_back',
      style: 'gentle',
      script: '妈，有合适的人我肯定会告诉你们的。但现在真的没有遇到特别合适的。我不想随便带个人回来敷衍你们，那样对人家也不公平。',
      usage: '温和表达，强调真诚'
    },
    {
      role: 'parents',
      questionType: 'when_back',
      style: 'humor',
      script: '妈，您这是给我下任务呢？行，等我把老板拿下，一定第一时间带回来见您！您看看您儿媳/女婿还在加班呢，多"敬业"啊。',
      usage: '幽默化解'
    },
    {
      role: 'parents',
      questionType: 'when_back',
      style: 'rational',
      script: '2023年的数据显示，一线城市平均相亲次数达到17次才成功。我这不是在努力吗？好的感情需要时间培养，我想认真对待这件事。',
      usage: '数据说话'
    },
    {
      role: 'parents',
      questionType: 'when_back',
      style: 'counter',
      script: '其实我也想问问，如果我真的带个人回来，你们会满意吗？还是会挑剔？我怕带回来你们又不喜欢，那多尴尬。',
      usage: '反问，转移压力'
    },
    {
      role: 'parents',
      questionType: 'when_back',
      style: 'philosophy',
      script: '张爱玲说："于千万人之中遇见你所要遇见的人，于千万年之中，时间的无涯的荒野里，没有早一步，也没有晚一步。" 妈，缘分这事急不得。',
      usage: '文学化表达'
    },

    // ===== 同辈 - 怎么还单着 =====
    {
      role: 'peers',
      questionType: 'have_partner',
      style: 'gentle',
      script: '哈哈，还在找呢。现在这个阶段，我觉得单身也挺好的，至少自由。有合适的会考虑的。',
      usage: '轻松回应'
    },
    {
      role: 'peers',
      questionType: 'have_partner',
      style: 'humor',
      script: '我在等国家分配呢！再说了，像我这么优秀的，国家得好好匹配一下，不能随便给我安排个路人甲吧？',
      usage: '自嘲幽默'
    },
    {
      role: 'peers',
      questionType: 'have_partner',
      style: 'rational',
      script: '其实单身和结婚都只是状态，没有好坏之分。我现在单身，但我过得挺充实的。结婚只是人生的一个选项，不是必修课。',
      usage: '理性看待婚姻'
    },
    {
      role: 'peers',
      questionType: 'have_partner',
      style: 'counter',
      script: '你呢？你幸福吗？如果幸福，恭喜你。如果不幸福，那你觉得我急着结婚有意义吗？',
      usage: '反问，让对方思考'
    },
    {
      role: 'peers',
      questionType: 'have_partner',
      style: 'philosophy',
      script: '王小波说："人活在世上，就是为了忍受摧残，想尽一切办法一直到死。我想，死之前得先痛快地活一场。" 我现在就挺痛快的。',
      usage: '引用名言'
    },

    // ===== 长辈 - 年龄大了抓紧 =====
    {
      role: 'elders',
      questionType: 'when_married',
      style: 'gentle',
      script: '叔叔您说得对，我会考虑的。谢谢您的关心，有合适的机会我会把握的。',
      usage: '礼貌回应长辈关心'
    },
    {
      role: 'elders',
      questionType: 'when_married',
      style: 'humor',
      script: '叔叔，您放心，我要是结了婚，一定第一时间请您喝喜酒！现在主要是国家还没给我分配呢，您帮我催催？',
      usage: '幽默回应'
    },
    {
      role: 'elders',
      questionType: 'when_married',
      style: 'rational',
      script: '现在的社会环境和以前不一样了。医学数据显示，女性的最佳生育年龄确实在放宽，而且晚婚在教育水平上更有优势。我会根据自己的节奏来的。',
      usage: '科普式回应'
    },
    {
      role: 'elders',
      questionType: 'when_married',
      style: 'counter',
      script: '叔叔，您当年是什么时候结婚的呀？那个年代的情况跟现在可不一样了。您觉得现在年轻人最大的压力是什么？',
      usage: '转移话题，聊别的'
    },
    {
      role: 'elders',
      questionType: 'when_married',
      style: 'philosophy',
      script: '有人说，婚姻是爱情的坟墓。我还没谈过恋爱呢，不想直接进坟墓。我想先谈一场恋爱，再考虑结婚。',
      usage: '哲学式表达'
    }
  ],

  // 获取话术
  getScripts(role, questionType, style) {
    return this.scripts.filter(s =>
      s.role === role &&
      s.questionType === questionType &&
      s.style === style
    );
  },

  // 随机获取一条话术
  getRandomScript(role, questionType, style) {
    const scripts = this.getScripts(role, questionType, style);
    if (scripts.length === 0) return null;
    return scripts[Math.floor(Math.random() * scripts.length)];
  },

  // 获取所有话术
  getAllScripts() {
    return this.scripts;
  }
};

// 数据反击卡
const dataCards = [
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
];

// 模拟社区帖子
const mockPosts = [
  {
    id: 1,
    avatar: '😎',
    userName: '匿名用户',
    time: '2小时前',
    type: '吐槽',
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
    type: '经验',
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
    type: '求助',
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
    type: '心情',
    title: '',
    content: '又一年过去了，还是单身。但我觉得单身也挺好的，自由自在，没有束缚。只是有时候看到别人一家三口逛街，心里还是会有一点点羡慕...',
    commentCount: 28,
    likeCount: 102
  }
];

// 游戏剧本
const gameScenarios = [
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
];
