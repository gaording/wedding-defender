# 催婚防御助手 - H5版本

春节快速部署方案，无需审核，即部署即用！

## 特点

✅ **无需审核** - H5网页不需要应用商店审核
✅ **即时上线** - 部署后立即可访问
✅ **完美适配** - 专为移动端和微信优化
✅ **零门槛** - 用户无需下载，点开即用
✅ **易分享** - 微信群/朋友圈一键分享

## 快速开始

### 方法1：Vercel部署（推荐，免费）

1. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **部署**
   ```bash
   cd h5-version
   vercel
   ```

3. **完成！** Vercel会给你一个链接，例如：`https://wedding-defender.vercel.app`

### 方法2：Netlify部署（免费）

1. 访问 [netlify.com](https://www.netlify.com/)
2. 拖拽 `h5-version` 文件夹到页面中
3. 几秒钟后获得访问链接

### 方法3：静态服务器

```bash
cd h5-version
python3 -m http.server 8000
```

访问：`http://localhost:8000`

### 方法4：Nginx部署

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/h5-version;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 文件结构

```
h5-version/
├── index.html          # 主页面
├── manifest.json       # PWA配置
├── css/
│   └── style.css      # 样式文件
├── js/
│   ├── app.js         # 主逻辑
│   ├── data.js        # 话术库数据
│   └── utils.js       # 工具函数
└── images/            # 图片资源（需补充）
```

## 核心功能

### 1. 首页
- 每日一句/幸运buff
- 数据统计展示
- 快速入口

### 2. 武器库
- **话术生成器**（4种对象×4类问题×5种风格）
- 数据反击卡

### 3. 树洞社区
- 匿名吐槽/求助/经验分享
- 用户可发布自己的帖子

### 4. 剧本杀游戏
- 游戏化练习应对技巧
- 优雅度/气氛值/杀伤力评分

### 5. 个人中心
- 催婚日记
- 成就称号系统
- 数据统计

## 数据存储

使用浏览器 `localStorage`，数据保存在用户本地：
- 用户成就数据
- 收藏的话术
- 写的日记
- 发布的帖子

**注意：** 清除浏览器数据会丢失这些内容。

## 分享方式

### 微信内分享

用户点击"分享给朋友"后，会显示引导：
```
点击右上角 ···
↓
选择"发送给朋友"或"分享到朋友圈"
```

### 非微信环境

直接复制链接分享给朋友

## 优化建议

### 1. 添加图标

在 `images/` 目录添加：
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

### 2. 自定义域名

- Vercel: 在项目设置中添加自定义域名
- Netlify: 在 Domain settings 中添加

### 3. 启用HTTPS

- Vercel/Netlify 自动提供HTTPS
- 自有服务器需配置SSL证书

### 4. 添加统计

在 `index.html` 的 `<head>` 中添加：
```html
<!-- 百度统计 -->
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?your_tracker_id";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
</script>
```

## 性能优化

- ✅ 已使用CSS渐变替代图片
- ✅ 已使用emoji替代图标
- ✅ 已优化DOM操作
- ✅ 已使用localStorage缓存
- ⚠️ 可考虑使用CDN加速

## 浏览器兼容性

| 浏览器 | 支持 |
|--------|------|
| 微信内置浏览器 | ✅ 完美支持 |
| Safari iOS | ✅ 完美支持 |
| Chrome | ✅ 完美支持 |
| Android浏览器 | ✅ 完美支持 |
| IE11 | ⚠️ 需要polyfill |

## 春节前时间表

| 日期 | 任务 |
|------|------|
| 今天 | 部署H5到服务器 |
| 今天 | 生成分享链接 |
| 明天 | 分享到各个群 |
| 春节期间 | 收集用户反馈 |
| 春节后 | 决定是否开发小程序/App |

## 常见问题

**Q: H5和小程序有什么区别？**
A: H5是网页，无需审核，即部署即用；小程序需要审核，但体验更好。

**Q: 数据会丢失吗？**
A: 数据保存在用户手机本地，除非清除浏览器数据，否则一直存在。

**Q: 可以分享到朋友圈吗？**
A: 可以！微信用户点击链接直接打开，无需下载。

**Q: 需要服务器吗？**
A: 不需要！Vercel/Netlify提供免费静态托管。

**Q: 能接入微信支付吗？**
A: H5可以接入微信H5支付，但需要企业资质。

## 技术支持

- GitHub Issues: [提交问题](https://github.com/your-repo/issues)

## 许可证

MIT

---

**春节快乐！愿每一个被催婚的你都能优雅应对！🍀**
