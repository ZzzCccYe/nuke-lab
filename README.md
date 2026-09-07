# Nuke Lab — 合成学习工作台

一个纯静态的 Nuke 中文学习参考站：视频课程索引、节点图鉴、菜单导览、交付格式规范与交互式渲染交付工具（Write 交付配置器 / 渲染队列 / 交付前检查）。

## 本地版与线上版

| | 本地版（D:\Codex） | 线上版（GitHub Pages） |
|---|---|---|
| 图文内容 / 交付工具 | ✅ | ✅ |
| 78 个教学视频（1.73 GB） | ✅ `videos/` 目录 | ❌ 不包含，播放处会友好提示 |

线上版只托管代码（不含视频，仓库仅几 MB）；视频始终保留在本地 `videos/` 目录，双击 `index.html` 即可正常播放。

## 目录结构

```
D:\Codex
├── index.html            # 页面入口（双击本地打开）
├── assets/
│   ├── css/styles.css
│   └── js/               # data.js 课程数据 / nodes.js 节点数据 / app.js 逻辑
├── videos/               # 教学视频（仅本地，不入库）
└── tools/
    ├── sync.ps1          # 本地 <-> 线上 双向同步脚本
    └── mingit/           # 免安装版 git（仅本地使用，不入库）
```

## 同步方法

本地改了代码（或在线上 github.com 网页里改了文件）之后：

```powershell
# 本地 -> 线上（提交并推送，GitHub Pages 1-2 分钟内自动更新）
powershell -ExecutionPolicy Bypass -File tools\sync.ps1 up

# 线上 -> 本地（拉取网页端做的修改）
powershell -ExecutionPolicy Bypass -File tools\sync.ps1 down

# 查看当前同步状态
powershell -ExecutionPolicy Bypass -File tools\sync.ps1 status
```

## 本地预览服务器（可选）

双击打开 `index.html` 已可完整使用。如需 http 预览：

```powershell
powershell -ExecutionPolicy Bypass -File tools\serve.ps1   # http://127.0.0.1:8771
```
