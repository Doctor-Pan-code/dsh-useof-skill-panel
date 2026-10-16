# 5.1.4 — fork 说明（dsh-useof-skill-panel）

本版是 `dsh-echocat-skill-panel@5.1.3` 的 fork，**唯一的功能性改动**：

## 删掉了输入框上方的摘要横栏

原版向三个 UI 席位注册内容，本 fork 只注册两个：

| 席位 | 原版 | 本 fork |
| --- | --- | --- |
| `main` | 完整报告面板 | ✅ 保留 |
| `sidebar.panellist` | 左侧边栏入口 | ✅ 保留 |
| `conversation.input.dock` | 输入框上方摘要横栏 | ❌ **删除** |

删除是**彻底**的：既移除了注册，也删掉了 `StripSurface` 组件本身。横栏和它下面的
`LiveRail` 细线都不会再挂载。

## 唯一的功能损失

`conversation.input.dock` 是三个席位里**唯一**能拿到输入框写权限的（`inputActions` + `useInput`），
所以"点一下技能名，把 `/技能名` 插进草稿框"这个功能随横栏一起消失。
报告面板仍可从侧边栏打开，装卸面板也照旧可用。

## 与原版共存所需的重命名

两个插件同时装，因此以下标识全部改为 `-panel2` 版本，避免与原版相撞：

- 包名 / 目录名 / bundle id：`dsh-useof-skill-panel`
- Loader 条目 id：`skill-report-use`（原版是 `skill-report`）
- 客户端面板 key：`skill-report-use`（`main` 席位的 key 与侧边栏 id 必须是同一个）
- HTTP 路由：`/api/skill-report-use/*`
- CSS 注入标记：`data-plugin="dsh-useof-skill-panel"`
- 状态目录：`~/.dsh/skill-report-use/`（原版用 `~/.dsh/skill-report/`）

**关于版本检查按钮**：本 fork 未发布到 npm，所以"检查更新"查的仍是**上游**包名
（`UPSTREAM_PACKAGE_NAME`），面板显示的名字则是本 fork 的名字。这样按钮回答的正是用户真正关心的
问题 —— "我 fork 的代码，上游有没有更新"。

## 与本机早期命名的差别

本 fork 最初在本机以 `dsh-echocat-skill-panel2` 的名字试装（Loader id 与路由用 `skill-report2`）。
发布到 GitHub 时统一改成了现在的 `dsh-useof-skill-panel` / `skill-report-use`。上表是**发布后**
的名字；两个早期名字在任何当前文件里都不再出现。

## 未改动

宿主侧（会话事件推导、安装引擎、备份/停用目录、快照路由）、报告面板、装卸面板、
背景与主题系统、品牌图标 —— 全部与原版逐字一致。

**保留上游原样的两处**：写在每个 skill 目录里的来源记录文件名 `.echocat.json`（它是数据格式而不是
身份标识，改名会让已装用户的历史记录失效），以及 `src/release.js` 里版本检查的地址（仍指向上游的
npm 包与 GitHub 发布页 —— 本 fork 未发布到 npm）。

*（上游 5.1.3 的发布说明见 [RELEASE_NOTES_5.1.3.md](RELEASE_NOTES_5.1.3.md)，仍然有效。）*
