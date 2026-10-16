# dsh-useof-skill-panel

> **本仓库是 [`dsh-echocat-skill-panel`](https://github.com/VDERR/dsh-echocat-skill-panel) 的 fork，署名与出处保留。**
> 与原版**同时安装**、互不干扰，功能上唯一的区别是**删掉了输入框上方那条摘要横栏**（`conversation.input.dock`）——
> 组件与注册一并删除，所以那条横栏根本不会被挂载。
> 面板、侧边栏入口、装卸面板、背景/主题、宿主侧全部与原版逐字一致。
>
> 代价只有一个：原横栏是唯一能往输入框里插入 `/技能名` 的位置，所以**一键插入技能名的功能没有了**。
> 要看那条横栏，启用原版（`dsh-echocat-skill-panel@5.1.3`）即可 —— 两个插件可以并存。

**v5.1.4** · DSH Desktop Beta 的 cordis 插件：统计每轮对话用到了哪些 skill，并让你**在应用里直接装卸、更新它们**。

判定不依赖模型自觉 —— 插件从会话事件流推导本轮调了哪些 skill（模型自动、你手动 `/name`、或一个都没用），模型忘了说也照样报。

![面板](docs/panel.png)

两个界面共用一份数据：

| 位置 | 说明 |
| --- | --- |
| **左栏图标** | 常驻入口，点它在中间打开面板（`sidebar.panellist`，order 60） |
| **中栏面板** | 完整报告 + skill 目录（`main`） |

> 与原版的可视差异：本 fork 只注册上面两个座位。原版的第三个座位——输入框上方的摘要横栏——已整体移除。

## 一键安装

把作者给的地址**整个粘进来**就行：

```
https://github.com/owner/repo/tree/main/skills/my-skill
```

仓库主页、仓库里的文件夹链接、`SKILL.md` 链接、zip 直链、`owner/repo`、SSH 地址都认 —— host 自己判断该克隆还是该下载，分支与子目录从地址里解析，不用你填三个框。也可以上传 `.md`/`.zip`，或直接粘贴整篇 `SKILL.md`。

同名不会静默覆盖：先备份再替换。装错了能删，**删掉的进备份目录，永不硬删**。

![安装面板](docs/install-sheet.png)

## 背景自定义（4.4）

面板可以有背景。报告右上角的「背景自定义」打开一张设置面板，**左侧是实时预览**，改一下看一眼，不满意随时取消 —— **预览、取消、恢复默认是三件不同的事**，不会"改了就算数"。

![背景自定义](docs/background-settings.png)

- **四类样式**：液态、柔和渐变、纯色、本地图片；**六套低饱和预设**（柔柔银蓝、珍珠白、紫棠、暖砂灰、深色金属、青瓷）直接挑一个开始。
- **每个滑块都真的作用于背景**：主色 / 辅助色 / 高光色，明暗、亮度、饱和度、对比、金属高光、柔化、遮罩、速度、形变、指针反馈 —— 而**不适用的选项会隐藏**，不是摆在那里让你调了没反应。
- **图片在本机处理**：接受 JPG/PNG/WebP（上限 8 MB），**在本机缩到长边 1920 以内**，支持铺满裁切 / 完整显示 / 拉伸与位置。图片和设置**单独存在客户端数据库里，不上传、不改动 skill 数据、不碰宿主配置**。
- **只影响当前客户端**：设置跨本插件的各个表面共享、刷新后保留，但**不宣称跨设备同步** —— 因为它确实不跨。
- 静态模式下背景**不持续渲染**；隐藏、卸载和系统"减少动态"仍然照常生效。

## 装了之后能更新（4.0）

**问题**：3.0 把地址用一次就丢了（git 克隆还会被删掉）。作者发了修复，你无从判断新旧，只能删了重装 —— 而删除是移动到备份。

**做法**：安装时把来源写进该 skill 自己的 `.echocat.json`：地址、分支、子目录、**安装时的 commit**、以及一份**内容指纹**。于是：

- 卡片上多一行来源。远端有新 commit 时标成「**可更新**」，点两下即替换，**旧版本先进备份**。
- 判断只跑一次 `git ls-remote`，**不重新下载内容**；来源固定在某 commit 上时不会被误报成"有新版"。
- **你手改过这个 skill 的文件**时，确认文案会明说"更新会覆盖它们" —— 这是唯一会丢改动的场景。
- 手工装的、或 2.x/3.0 装的 skill 没有这条记录，卡片上给一个「标记来源」，填一次地址即纳入更新。
- 中文显示名不受影响：更新沿用你为该 skill 设的 `display-name-zh`。

## 界面

- **宽度跟着界面缩放**：面板的宽度由宿主自己的输入框宽度推导（`--dsh-composer-card-max-width` 减 16px），**永远比输入框窄**，并且和输入框共享同一条中轴 —— 宽窗口、窄窗口、嵌入式布局都对。
- **一套完整的设计语言**：四个表面台阶（画布 / 卡片 / 抬升 / 下沉）、一个强调色（靛蓝，只用于主操作、选中和"有东西可做"）、五级字阶（10.5 → 26px，字号越大字距越紧）、三级投影（每级两层低透明度叠加），发丝线用 `color-mix` 从墨色推导。
- **1006 条具名调整**：239 项行为打磨（[polish.js](src/client/polish.js)）+ 767 项设计重做（[design.js](src/client/design.js)），全部是带名字和理由的数据记录，样式表由它们生成，测试逐条核对真的生效。
- **插件自己也能检查更新**：面板头部有一组按钮 —— 「检查更新」问 npm 与 GitHub 谁更新（10 分钟缓存，只有点击才联网），旁边是 GitHub 发布页跳转。查到新版本时按钮带强调色和一个小圆点，头部还会直接写出「可更新 x.y.z」；"查不到"和"已是最新"是两句不同的话。
- **skill 名字一行显示全**：卡片是三行结构（名字行 / 说明 / 按钮行）。名字独占整行并且**会换行、不会被省略号截断** —— 之前它和六个按钮抢一行，长名字只剩几个字符加省略号。
- **每个 skill 一个开关**：停用会把目录**移出 DSH 监视的 skills 目录** —— 模型真的加载不到它，而文件一个不少，随时一键启用回来。已启用与已停用分两组列出，停用的卡片仍可改名、查来源、更新、删除。
- **深浅两套都验过**：深色盘同时挂在系统偏好与**应用内主题**两条信号上；所有文字色都按 WCAG 算过对比度（正文 18.2:1、次级 6.4:1、元数据 5.3:1）。
- `prefers-reduced-motion`、`prefers-reduced-transparency`、窄屏布局各自有覆盖。
- 改界面的做法：`node tools/preview.mjs` 渲染真实面板并截图，加 `--measure` 打印计算样式 —— **先看见，再改**。

> 原版横栏那一行的四个计数器，随横栏一起移除了；计数仍然在面板里。

## 中文显示

中文名写进该 skill 自己的 `meta.yaml`（`display-name-zh`），面板就按中文显示。安装时能填，装完在卡片上随时能改，留空则清除。

`/名字` 手势仍然走 ASCII 代号，两者互不干扰。

## 安装

**GitHub 源码**（拿到的是完整包）：

```powershell
git clone https://github.com/Doctor-Pan-code/dsh-useof-skill-panel.git
cd dsh-useof-skill-panel
npm install            # 只装两个 optional peer，运行时并不需要
```

然后把仓库目录接进你的 profile（`<DSH_HOME>` 默认是 `~/.dsh`）：

```powershell
# 1) 在 <DSH_HOME>/profiles/<你的 profile>/package.json 的 dependencies 里加：
#      "dsh-useof-skill-panel": "link:<本仓库的绝对路径>"
# 2) 在同文件的 dsh.profile.bundles 数组里加：
#      "dsh-useof-skill-panel"
# 3) 再 pnpm install 一次
```

`cordis.patch.yml` 已经随包提供，bundles 里声明它就会自动挂载 —— 不需要手写 patch 行。

> 两个 `peerDependencies`（`@deepseek-ai/dsh-llm`、`@deepseek-ai/schemastery`）标了 `optional`：由 DSH 运行时提供，npm 不会自己去下载一份来顶替宿主的那份。

> **装完必须重启 DSH Desktop Beta。** host 半侧在 boot 时快照进内存，而客户端 bundle 每次开页面会重新拉取 —— 所以只改客户端刷新页面就够，**改了 host 必须重启**。

手动安装的四步、卸载回滚，以及**五条会让应用起不来的硬性约束**都在 [安装说明.md](安装说明.md)。

## 更多

每轮结束弹一次系统原生通知；给没中文的 skill 自动翻译并缓存；深色主题；宿主不允许写入时自动变只读并说明原因；全部配置项 —— 见 [安装说明.md](安装说明.md)。

架构与实现要点、安装引擎的四条安全规矩、**宽度为什么用百分比而不是像素**、**停用为什么是"移出目录"而不是改名**、**1006 条调整为什么是生成的**、**设计重做是怎么"先看见再改"的**、**来源记录为什么放在 skill 目录里**、**版本比较为什么不能拿字符串比**、**为什么"声明进了样式表"不等于"规则能命中元素"**（4.0.1 整页空白 bug 的教训）、**踩过的坑**（宿主语义令牌不能当视觉令牌用、逗号选择器不能共享组合符、`min-height:0` 会架空粘底页脚、CSS 注释里的反引号会截断样式表……）—— 见 [docs/设计要点.md](docs/设计要点.md)。

## 开发

```powershell
node tools/build-client.mjs        # 生成 lib/client.js（改了 src/client/ 就必须跑）
npm test                           # 十四个套件，1520 项断言
node tools/preview.mjs             # 渲染真实面板并截图（浅色 + 深色）
node tools/preview.mjs --measure   # 打印关键元素的计算样式
node tools/check-width-live.mjs    # 真 Chrome 量宽度（改了宽度规则就跑）
```

> `lib/client.js` 是**入库的构建产物**（目标机器没有工具链，`lib/` 必须一起提交）。**改了 `src/client/` 就要在同一个 commit 里重建它**，漏了 `test/client-bundle.mjs` 会在门里失败。

运行时没有任何依赖；`@deepseek-ai/dsh-llm` 与 `@deepseek-ai/schemastery` 是 host 提供的 peer。

## 相对上游的改动

本 fork 与 [`dsh-echocat-skill-panel@5.1.3`](https://github.com/VDERR/dsh-echocat-skill-panel) 的差异**只有一处功能改动**，为了能与原版同时安装，另有一组标识符改名：

| 项 | 上游 | 本 fork |
| --- | --- | --- |
| 座位 | 三个（含输入框上方横栏） | **两个**（`main` + `sidebar.panellist`） |
| 目录 / 包名 / bundle id | `dsh-echocat-skill-panel` | `dsh-useof-skill-panel` |
| loader entry id | `skill-report` | `skill-report-use` |
| 客户端面板 key | `skill-report` | `skill-report-use` |
| HTTP 路由 | `/api/skill-report/*` | `/api/skill-report-use/*` |
| CSS 标记 | `data-plugin="dsh-echocat-skill-panel"` | `data-plugin="dsh-useof-skill-panel"` |
| 状态目录 | `~/.dsh/skill-report/` | `~/.dsh/skill-report-use/` |

**保留上游原样**的两处：写在每个 skill 目录里的来源记录文件名 `.echocat.json`（它是数据格式不是身份标识，改名会让已装用户的历史记录失效），以及 `src/release.js` 里的版本检查地址（仍指向上游的 npm 包与 GitHub 发布页 —— 本 fork 未发布到 npm）。

## 许可

MIT，见 [LICENSE](LICENSE)。Copyright (c) 2026 dsh-skill-report contributors.
