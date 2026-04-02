# Academic Homepage Template

这个模板参考了 [crabwq.github.io](https://crabwq.github.io/) 的结构，但实现方式更简单：

- 纯静态页面，不需要构建工具
- 单页结构，适合 GitHub Pages
- 所有内容集中在 `site-data.js`
- 论文列表、获奖、学生信息由脚本自动渲染
- 比原站多了基础响应式适配，手机上也能正常浏览

## 文件说明

- `index.html`: 页面骨架
- `site.css`: 样式
- `site-data.js`: 你的个人资料和内容数据
- `site.js`: 渲染逻辑
- `assets/avatar-placeholder.svg`: 占位头像

## 你主要需要改哪里

1. 修改 `site-data.js` 中的 `profile`
2. 修改 `education`、`experience`、`researchInterests`
3. 把 `publications.journals` 和 `publications.conferences` 换成你的论文
4. 把 `honors`、`activities`、`students` 换成你的信息
5. 如果你有正式头像，把 `profile.avatar` 改成图片路径，例如 `assets/me.jpg`

## 论文数据格式

```js
{
  authors: "Y. Name, C. Student, and C. Collaborator",
  title: "Paper title",
  venue: "Pattern Recognition",
  details: "vol. 180, pp. 100001, 2026",
  pdf: "https://example.com/paper.pdf",
  code: "https://github.com/your/repo",
  project: "https://your-project-page.example.com",
  dataset: "https://your-dataset.example.com",
  highlight: true
}
```

`highlight: true` 会把期刊或会议名标红，适合突出代表作。

## 部署到 GitHub Pages

1. 新建一个仓库，例如 `<your-github-username>.github.io`
2. 把这些文件推到仓库根目录
3. 在 GitHub 仓库设置里确认 Pages 使用默认分支发布
4. 访问 `https://<your-github-username>.github.io/`

## 和参考站的差异

- 保留了单页学术主页的整体信息架构
- 去掉了 jQuery 和远程 GitHub API 依赖
- 不再需要维护多个 JSON 文件，直接改一个 `site-data.js`
- 增加了移动端适配
