# 🚀 3分钟快速部署指南

## 方式1：Vercel部署（推荐，完全免费）

### 步骤：

1. **访问Vercel官网**
   - 打开 https://vercel.com
   - 点击 "Sign Up" 或 "Log In"
   - 推荐用GitHub账号登录（秒登）

2. **导入项目**
   - 点击 "New Project"
   - 选择 "Import Git Repository" 或直接拖拽文件夹
   - 如果拖拽：直接把整个 `h5-version` 文件夹拖进去

3. **配置项目**
   - Project Name: 随便填，比如 `wedding-defender`
   - Framework Preset: 选择 "Other"
   - Root Directory: 留空
   - 点击 "Deploy"

4. **完成！**
   - 等待30秒左右
   - Vercel会给你一个链接，比如：
     ```
     https://wedding-defender.vercel.app
     ```

---

## 方式2：Netlify拖拽部署（最简单）

### 步骤：

1. **访问Netlify Drop**
   - 打开 https://app.netlify.com/drop

2. **拖拽部署**
   - 直接把 `h5-version` 整个文件夹拖到页面上

3. **完成！**
   - 几秒钟后获得链接，比如：
     ```
     https://amazing-jones-123456.netlify.app
     ```

---

## 方式3：GitHub Pages（免费，需有GitHub账号）

### 步骤：

1. **创建GitHub仓库**
   - 在GitHub创建新仓库 `wedding-defender`

2. **上传文件**
   - 把 `h5-version` 里的所有文件上传到仓库

3. **启用Pages**
   - 仓库 Settings → Pages
   - Source选择 `Deploy from a branch`
   - Branch选 `main` 或 `master`
   - 点击Save

4. **完成！**
   - 几分钟后获得链接：
     ```
     https://your-username.github.io/wedding-defender/
     ```

---

## 🎯 部署后要做什么

### 1. 生成二维码

把你的链接（比如 `https://wedding-defender.vercel.app`）转换成二维码：

**方法A：在线生成**
- 访问 https://cli.im/ 或 https://www.qrcode-generator.com/
- 输入你的链接
- 下载二维码图片

**方法B：命令行（如果你有qrencode）**
```bash
qrencode -o qrcode.png "https://你的链接"
```

### 2. 分享到微信群

```
🎉 春节神器上线了！

催婚防御助手 - 帮助大家优雅应对催婚问题
👉 点击链接直接使用（无需下载）
https://你的链接

功能：
✅ 话术生成器（4×4×5=80种组合）
✅ 催婚日记
✅ 树洞社区
✅ 剧本杀游戏

春节必备！转给需要的战友！🍀
```

### 3. 朋友圈文案

```
春节自救指南来了！🎉

做了个"催婚防御助手"，80种话术帮你优雅应对催婚。
点开就能用，无需下载，今年春节不尴尬！

链接→ https://你的链接

#春节 #催婚 #自救指南
```

---

## 📊 数据统计（可选）

想看有多少人使用？在 `index.html` 的 `<head>` 中添加：

```html
<!-- 百度统计 -->
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?你的统计ID";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
</script>
```

申请地址：https://tongji.baidu.com/

---

## ⚡ 常见问题

**Q: 部署后链接打不开？**
A: 等待1-2分钟，CDN同步需要时间

**Q: 想改域名？**
A: Vercel/Netlify都支持自定义域名，在项目设置中添加

**Q: 数据会丢失吗？**
A: 用户数据存在他们手机本地，清除浏览器数据才会丢失

**Q: 能收费吗？**
A: H5可以接入微信H5支付，但需要企业资质

---

**部署完成后，把链接发给我，我帮你生成二维码！**
