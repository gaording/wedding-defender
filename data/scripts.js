// 话术库数据
const scriptsData = {
  // 提问对象
  roles: ['parents', 'relatives', 'peers', 'elders'],

  // 问题类型
  questionTypes: ['when_married', 'have_partner', 'when_back', 'compare_others'],

  // 回应风格
  styles: ['gentle', 'humor', 'rational', 'counter', 'philosophy'],

  // 话术库
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
    )
  },

  // 随机获取一条话术
  getRandomScript(role, questionType, style) {
    const scripts = this.getScripts(role, questionType, style)
    if (scripts.length === 0) {
      return null
    }
    return scripts[Math.floor(Math.random() * scripts.length)]
  },

  // 获取所有话术（用于浏览）
  getAllScripts() {
    return this.scripts
  }
}

module.exports = scriptsData
