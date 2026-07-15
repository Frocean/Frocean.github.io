
项目概述
---------

这是基于 Hugo 的静态网站源码（Frocean.github.io）。我已将原先的静态页面迁移为 Hugo 项目，包含基本模板、样式与示例内容，便于使用 Hugo 本地预览与生成部署到 GitHub Pages。

项目结构（重要目录）
- config.toml              — Hugo 配置文件
- content/                 — Markdown 内容（按分类组织）
- layouts/                 — Hugo 模板（base、index、single）
- static/css/index.css     — 样式文件（会被复制到站点根的 /css/）
- static/images/           — 静态图片资源（站点引用路径为 /images/...）
- .github/workflows/       — GitHub Actions 工作流（自动构建并部署到 GitHub Pages）

快速开始
1. 安装 Hugo（推荐 Hugo Extended）。
2. 在仓库根运行本地预览：

   hugo server -D -s .

   打开 http://localhost:1313 查看网站。

3. 生成静态站点文件：

   hugo

关于图片迁移
- 如果你的图片原先位于仓库根的 images/ 目录，已提供 scripts/move-images.ps1 脚本用于迁移（若已经手动迁移，该脚本可删除或忽略）。当前静态图片应放在 static/images/ 下。

基于标签的自动归类（Taxonomies）
- 本站使用 Hugo 的 tags taxonomy 管理文章归类。所有文章均放在 content/posts/，并在 front matter 中通过 tags 字段指定标签，例如：

  ---
  title: "深入理解 CSS Grid 布局"
  date: 2026-06-20
  tags: ["tech", "css", "前端"]
  ---

- 通过 data/navigation.yaml 配置哪些标签显示在侧边导航，并在 layouts/partials/sidebar.html 中读取，渲染左侧导航并高亮当前标签页或当前文章的标签。

GitHub Actions 与部署
- 已添加 .github/workflows/deploy.yml，用于在 push 到 master 时构建并部署到 GitHub Pages。请确认仓库设置中允许 Actions 使用写入 Pages 的权限（Settings → Actions → General → Workflow permissions 设置为 Read and write）。如需使用个人访问令牌 (PAT)，请在仓库 Secrets 中添加并告知，我可以帮你切换工作流配置。

清理说明
- 我已移除构建产物 public/（若你本地仍有该目录，可以删除以避免将生成文件提交到源码仓库）。
- 已将 IDE 工作区目录 .vs 加入 .gitignore，避免将本地开发环境文件纳入版本控制。

后续建议
- 若希望更接近原先外观，可继续调整 layouts/ 中的模板或引入成熟主题。
- 需要我为你把所有文章的更完整内容迁移为 Markdown 文件，或配置 RSS、sitemap、社交卡片等功能，请告知具体需求。

项目细节与功能说明
------------------

重要文件与目录说明：
- config.toml — Hugo 配置（注意已使用 locale 替代已弃用的 languageCode）
- content/posts/ — 所有文章请放在此目录，使用 front matter 的 tags 字段进行归类
- data/navigation.yaml — 侧栏导航配置（在此注册希望出现在侧栏的 tag，并定义显示名称 title）
- layouts/ — 模板目录：
  - layouts/_default/baseof.html — 基础页面框架（head/header/sidebar/main/footer）
  - layouts/_default/single.html — 单文章 main 内容（面包屑/文章正文）
  - layouts/index.html — 首页 main 内容（文章列表）
  - layouts/partials/sidebar.html — 读取 data/navigation.yaml 渲染左侧导航并高亮当前项
  - layouts/taxonomy/term.html — 标签归档页模板（优先显示 data/navigation.yaml 中的 title）
- static/css/index.css — 全站样式（更改字体/配色/链接颜色请在此修改）

侧栏与标签的工作方式：
- 侧栏读取 data/navigation.yaml 中的 items 列表，按每项的 tag 字段生成链接 /tags/<tag>/ 并显示 title 与该 tag 下的文章数量。
- 若你希望某个 tag 出现在侧栏，请在 data/navigation.yaml 中添加对应项，确保文章 front matter 中的 tags 使用与该项相同的 tag 字符串（建议统一小写）。

面包屑与归档页显示逻辑：
- 单篇文章页面（single.html）会优先匹配 data/navigation.yaml 中的项并在面包屑中显示文章原始 tag（保持文章 front matter 的原始大小写），点击该类别跳转到对应的标签归档页。
- 标签归档页（/tags/<tag>/）的标题优先显示 data/navigation.yaml 中配置的 title（如果存在），否则显示默认的标签名称。

关于 Hugo 报警（deprecation warnings）与已做的调整：
- WARN: languageCode 已弃用 — 我已将 config.toml 中的 languageCode 替换为 locale（例如 locale = "zh-CN"）。
- WARN: .Site.Data 已弃用 — 模板中已将 .Site.Data 改为 hugo.Data（例如 hugo.Data.navigation.items），以兼容最新 Hugo 版本并避免未来移除时出错。

样式修改位置
- 所有外观样式集中在 static/css/index.css。需要修改面包屑颜色、字体或其它样式，请直接编辑该文件并刷新 hugo server。

添加新文章或导航项的建议流程
1. 新文章：在 content/posts/ 新建 md 文件，填写 front matter（title、date、tags、excerpt 等），确保 tags 中含有你希望归类的 tag。
2. 若该 tag 需要出现在侧栏：在 data/navigation.yaml 中添加对应项（tag 与文章 tags 一致），并设定 title（显示名称）。
3. 运行本地预览： hugo server -D -s .，检查侧栏与归档页是否如预期显示。

如果需要，我可以：
- 批量扫描 content/posts 中未注册到 data/navigation.yaml 的 tags，并生成一个建议的 navigation.yaml 草稿供你审阅；
- 或将侧栏改为自动列出所有 tags（无需手动维护 navigation.yaml），但这会失去自定义显示名称与排序能力。

