---
name: lymow-web-design
description: Create, implement, review, or refine Lymow websites, landing pages, product feature sections, PDPs, marketing sections, and Shopify UI using evidence-backed Lymow typography, colors, layout, components, imagery, and responsive rules. Use for Lymow 建站、UI设计、页面开发、视觉优化. Not for unrelated brands or unrequested rebranding.
license: MIT
compatibility: Works with agents that read Agent Skills Markdown, including Codex, Claude Code, and Cursor. Browser access is needed for live visual comparison; Shopify conversion additionally requires appropriate Shopify tooling and project access. No executable runtime is required to load the skill.
metadata:
  version: "1.2.0"
  baseline-date: "2026-10-27"
---

# LYMOW WEB DESIGN SKILL

## Public distribution notes

This is an independent, unofficial design-analysis skill, not a Lymow product or endorsement. The license covers the maintainers' original instructions, helper code and independently authored examples only; it grants no rights to third-party trademarks, photos, video, fonts, website code, or other brand assets. Linked public resources are evidence, not a redistribution license. Use assets only when you have the necessary rights; if rights for a requested publication are unclear, pause that publication and explain the specific gap.

Read the Quick Start and all relevant numbered sections before implementation. The detailed, validated baseline remains in Chinese to preserve its exact measurements and exceptions; respond in the user's requested language. Task-start reporting is automatic and disclosed below; teammates do not configure a receiver or complete an enrollment prompt. There is no background daemon. The skill grants no permission to deploy a site or modify a store. Live reference checks are task-driven. Independent demo code is not original Shopify Liquid.

## Automatic task reporting — run at the start of a task

This distribution reports installation registration and independent Lymow task starts to the maintainer's private Feishu table through the bundled public relay. Fields are: a persistent random local alias (or operator name explicitly supplied for reporting), event ID, event type, timestamp, ISO week, count, skill name/version and agent. It sends no chat text, page copy, project paths, assets, OS account names or hardware identifiers. This is disclosed automatic reporting, not a hidden monitor. The person can stop it with `node scripts/report_usage.mjs disable` or `LYMOW_USAGE_DISABLED=1`; respect an existing opt-out. Hosting providers observe ordinary HTTP metadata.

At the start of each new independent Lymow implementation or review task, execute:

```sh
node <absolute-path-to-this-skill>/scripts/report_usage.mjs record --task-id <stable-random-task-id> --agent <codex|claude-code|cursor|other>
```

Resolve the script relative to this SKILL.md. Generate one random task ID per independent requirement and reuse it for retries, follow-up edits and resumed work on the same requirement. A different requirement gets a new ID, even in the same chat. Do not use project names, copy, URLs, file paths or personal information as task IDs. Reading/installing/maintaining the skill itself is not a design task and must not count as a run.

No setup, receiver file, Feishu login or extra confirmation is required. On first actual use the script creates a persistent random alias, registers this installation once, and records the task. If the operator explicitly supplies their own name for statistics, pass `--person` on first use; otherwise omit it without asking for a name. Never infer the operator's identity from content or regenerate an alias for each task. Existing local identities and disabled settings are preserved. Reports indicate task starts, not completed pages. Installation without first use is not observable by this script.

Do not bypass host tool/network permissions. If Node.js or network access is unavailable, continue the design task and briefly report the statistics gap; queued failures retry on a later invocation. Do not instruct a colleague to configure a private receiver as a workaround. [Reporting details and owner maintenance](references/team-usage.md) explain limits and the legacy helper; reading them is only necessary for troubleshooting. The measured design rules below are unchanged.

## AI 快速执行指南

1. **先选页面家族。** 产品卖点＝黑底技术叙事；购买区＝白底且先确认P-A/P-B；配件＝黑底白卡；普通内容＝白底窄栏。常规营销先选同职责模块（§6.10），不能默认白底双栏；只有明确活动brief才采用金色等活动皮肤。见§5/§7。
2. **锁定核心样式。** Open Sans；正文400、标题通常600。首页章节48/32px，产品故事40/28px（桌面/390手机）；场景Hero另按§6.10，不把主题H2默认58px套给所有标题。黑/白为基础，商务CTA用#04C374；灰阶渐变仅用于适合的深色技术标题。
3. **先容器，后细节。** 故事内容通常1200px、宽内容1400px；手机故事边距12px、主题内容20px。参考组件常见120/60px章节节奏、胶囊CTA60px圆角；商品卡4px与技术媒体18/9px不可混用。组件例外见§6。
4. **先复用，再新增。** 检查现有Shopify主题的section、snippet、settings与assets；Header、图库、变体、购买表单、FAQ沿用成熟组件。无源码时只做明确标记的重建，不假称已复用或MCP验证。
5. **守住边界。** 真实型号、能力与素材；不编造价格/折扣/评价，不重造品牌字体与颜色，不引入无依据的装饰。冲突按§2核实；[I]为建议，不能覆盖[C/R]实证。
6. **完成必须看图。** 在1440/390截图，补查768；与同职责官网模块对照字体/换行、留白、媒体裁切、CTA和信息密度。确认字体已加载、无整页横溢出、手机不只是缩小；再查hover/focus、交互与sticky遮挡。Shopify转换另须完成§11的MCP校验和本地启动。

以上为导航，不替代相应组件规则；正式实现前阅读所选页面家族与§6相关配方。

## 1. Purpose & Scope

让新页面在视觉、比例、素材和交互上属于 Lymow。输入为本文件、新业务需求、已确认文案与真实素材；输出应复用现有主题能力，而非另造一套“科技网站”。本Skill包可独立使用；核心详细规则在随包分发的references/design-system.md，必须按下方指引读取，不依赖未分发的截图或私人文件。

取证日期：**2026-10-27，Asia/Shanghai**。对象：`www.lymow.com` 英文 / 美国站显示内容，公开主题资源路径 `/cdn/shop/t/82/`。这是一份有日期的设计基线，不是永久有效的促销、产品参数或价格来源。

证据标记：**[C]** 公开 CSS / 渲染后样式声明；**[R]** 浏览器 Computed Style、尺寸或实际交互；**[V]** 截图观察；**[I]** 为新模块提出的推导 / 建议。表内未逐行标注时，以表标题标记为准。`[C]` 不等于拿到了原始 Liquid 或已验证 Shopify schema。

**先识别页面家族：** 首页与产品故事以黑底叙事为主；购买区为白底；配件集合为黑底白卡；政策内容为白底窄栏。当前黑五页面另有米白 / 金色活动皮肤。不要把这五种场景压成一套背景和字号。

## 2. Non-negotiable Rules

1. 不得擅自更换字体、品牌色、容器体系、CTA 形态或图片风格。不得以“更高级”“更容易编码”为理由偏离。
2. 优先级：**当前确认的品牌 / 项目规范 → 已验证的官网规则 → 已确认适用的主题组件与 Tokens → 本文件 [I] 建议**。发生冲突先核实 URL、模板、视口和覆盖样式；不得发明第三种折中风格。无法核实时保留项目现状并明确未知。
3. 有现成组件就复用。不要重写外观近似的 Header、购买表单、产品图库、变体、FAQ 或抽屉；这些包含行为与平台依赖。
4. 新模块允许改变信息结构，但必须使用匹配页面家族的字体、颜色、密度、间距和素材。模块顺序由业务决定，不机械照搬整页。
5. 禁止无证据的大面积彩色渐变、玻璃拟态、漂浮阴影、装饰网格、无关图标、复杂 3D 转场和弹跳。**已验证例外**：灰阶金属文字渐变；真实产品工程示意 / 气流可视化；活动授权的金色装饰；少量控件阴影。例外不能扩散到所有模块。
6. 使用真实对应型号的产品图片、视频、Logo 与工程资料。不得生成错误履带、刀盘、传感器、充电结构；不得把别的型号图片换个标题使用。产品能力、价格、库存、认证、赠品及人物评价必须来自本次业务证据。
7. 不把当前促销价格、黑五角标、倒计时、抽奖插件、客服头像、cookie 弹窗写成长期品牌组件。第三方插件的默认紫色、蓝色、字体变量不等于 Lymow 品牌色。
8. 不复制线上遗留缺陷：空标题、导入文档类名、隐藏内容占位、极端 z-index、无必要的负 margin、重复 ID 或过小点击区域。修复方式应保持视觉语言。
9. 仅获网页设计授权不代表可以发布、改店铺配置、提交订单或替换线上主题。

## 3. Lymow Design DNA

- **用黑色作为产品故事的舞台。** 大段纯黑承接金属灰标题、白色指标与草坪视频；图像本身提供绿色和质感。不要给每一段都套一张浅灰卡。[V: H/P]
- **硬件与真实作业证据是视觉重心。** 低角度履带机身、刀盘细节、庭院俯拍和真实割草结果交替出现。技术感来自结构、性能演示、工程说明，不来自无意义的霓虹 UI。[V: H/P]
- **按内容职责改变密度。** 产品故事一屏集中解释一个能力，短标题＋窄段落＋大媒体；购买区允许价格、权益、变体与 CTA 密集排列；政策页是普通连续阅读。[V]
- **大段留白用于切换主题，小间距用于绑定相关信息。** 定制故事段落常见上方 120px / 手机 60px；标题和正文间 24px / 15px，卡片正文贴近对应图片。不要把所有 section 上下各加 120px。[C/R]
- **标题有两种位置。** 新能力章节通常将标题置于横向实景图内；具体解释通常将标题与正文置于黑底、媒体上方。性能指标与媒体也可用不对称双栏。[V: P]
- **白底用于购买与阅读，黑底用于证据叙事。** 白色 PDP 购买区之后可直接切入黑色技术叙事；集合页白卡上的产品留白保证识别度；不能因此推断全站都应白底。[V]
- **CTA 是圆润而克制的功能锚点。** 商务 CTA 常为绿色胶囊，深色 Hero 也用白底黑字胶囊；卡片与媒体圆角明显小于按钮。无需让每个卖点都出现购买按钮。[C/R/V]
- **绿色有明确角色。** `#04C374` 用于主要购买动作、选中状态及局部品牌强调；自然草坪绿色来自照片，不能取草地平均色作为 UI 品牌色。[C/V]

## Detailed design rules — required before implementation

Read [Design system: sections 4–10](references/design-system.md) before generating or changing UI. It contains the complete measured token tables, component recipes and examples, page-family decisions, media rules, responsive breakpoints and Do / Don't rules. References such as §4, §6.10 and §9 in this entrypoint refer to that file. Component overrides take precedence over general token tables; do not implement from the Quick Start alone.

The [prior validation history](references/validation-history.md) is optional context for reviewing evidence and limitations; it is not a required asset dependency.

## 11. AI Execution Workflow

1. **识别目标。** 确认页面家族、当前URL/模板、业务主行动、已有素材和语言。新的业务内容不沿用调研时促销与价格。
2. **读项目。** 如有源码，检查layout、templates、sections、snippets、assets、config、locales和既有tokens。先确定能复用什么，再新建；不得声称公开HTML就是原始Liquid。
3. **选择参考。** 在本文件Reference中选同家族、同职责的具体模块，记录URL、模块定位、视口以及要继承的背景、字体角色、媒体构图、CTA和移动顺序。只有页面URL或零散tokens不足以证明视觉一致性；新布局部分标[I]。检查当前是否仍有效。网站变化时记录新证据，不静默覆盖基线。确认最终URL，尤其P-A/P-B。
4. **建立页面映射。** 简短列出每段的组件、容器、字体角色、背景、媒体、CTA和移动行为。只有缺少信息确实阻碍正确实现时才询问；一般布局选择依本文件自行推进。
5. **实现。** 使用现有组件和设置，新增CSS限定作用域，避免全局选择器污染；参数、素材、alt、CTA链接可配置。尽可能保证无JS可读。
6. **真实渲染。** 等字体与媒体加载，在1440和390截图；使用相同页面家族比较标题比例、左右边界、媒体面积、留白、裁切与购买入口。先修结构，再修字体，再修细节。
7. **验证交互。** Tab选中、轮播边界、FAQ开合、菜单、图库、变体状态、focus、键盘、reduced-motion、sticky遮挡都检查；未实际运行的部分明确列出。
8. **简洁交付。** 报告文件、已执行验证与确实未验证部分。不得把“静态截图相似”写成“Shopify运行成功”。

### 当任务包含 HTML/CSS/JS → Shopify 转换时的强制门槛

本门槛只在真正转换或交付Shopify项目时触发；本次设计研究与独立视觉测试未进行转换。

- 编辑前检查源HTML/CSS/JS、图片、字体和运行假设；拆分为适当layout/template/section/snippet/assets，不能整页粗暴塞进一个Liquid文件。
- 必须使用当前可用的 **Shopify MCP** 校验结构、Liquid、schema JSON、settings、资产引用和平台兼容性；若工具未启用 / 不具备验证能力，停止宣称MCP已验证，告知需要启用，或询问用户是否接受明确记录的fallback路径。
- 实际运行可用的theme check、lint/build与本地Shopify preview/dev；修完阻塞错误再交付。本地启动成功是交付的一部分，不能改成可选后续。
- CSS/JS使用Shopify兼容资产加载方式；动态图片复用主题与Shopify图片能力；schema必须为`{% schema %}`中的有效JSON。不要假设本文件自带原站section schema或事件API。
- 最终明确报告**MCP的具体工具与验证结果、实际执行的命令、Shopify是否无错误启动**；受账号 / 店铺访问阻塞时如实报告，不能用普通静态server代替成功声明。

## 12. Quality Checklist

- [ ] 已确认页面家族和最终产品URL；没有混淆模板差异与响应式。
- [ ] Open Sans真实加载，正确字重；标题字号/行高/字距匹配目标组件。
- [ ] 字号没有被语义H标签误导；标题换行、正文宽度与英文参考具有相近节奏。
- [ ] 1200/1400容器、移动12/20边距与目标组件一致；没有双重padding。
- [ ] 营销模块已有同职责参考；没有只匹配tokens却使用无依据的通用模板，测试注释不抢主视觉。
- [ ] 黑 / 白区的用途正确，CTA绿与活动palette分离；灰阶渐变仅用于适合的深色标题。
- [ ] 图片对应型号、主体完整、构图匹配；已核对实际像素、渲染宽度与DPR，没有放大低清poster冒充高清；没有编造参数、评价、认证或库存。
- [ ] 按钮、商品卡、技术卡的圆角各自正确；无额外装饰与大面积阴影。
- [ ] 1440/390真实截图已检查；平板、超宽不溢出；移动卡片与Tabs模式正确。
- [ ] 菜单、Tabs、FAQ、轮播及购买区状态可用；触摸、键盘、focus与reduced-motion有处理。
- [ ] sticky/footer/cookie/客服不会挡住关键操作；视频有poster并控制加载。
- [ ] [I]推导值有明确标记，未把截图估计冒充computed测量。
- [ ] 若属于Shopify转换，已完成本节前述MCP与本地启动门槛。

## 13. Reference & Evidence

### 页面与取证范围

| ID | 实际发现并访问的URL | 用途与范围 |
|---|---|---|
| H | [Homepage](https://www.lymow.com/) | 导航、多个Hero、卖点切换、视频Tabs、用户内容、服务Bento、新闻、Footer；1440/390完整截图，768/1920组件尺寸补测 |
| P-A | [One Plus PDP：robotic](https://www.lymow.com/products/lymow-one-plus-robotic-lawn-mower) | 原生购买区＋完整产品技术故事、指标图文、工程卡、媒体、规格和FAQ；1440/390 |
| P-B | [One Plus PDP：robot](https://www.lymow.com/products/lymow-one-plus-robot-lawn-mower) | 首次移动访问由P-A实际跳转发现；再单独核查1440/390，确认独立`.lps`购买模板 |
| M | [Promotion](https://www.lymow.com/pages/promotion) | 当前黑五Hero、活动机制、活动商品购买、评论视频、FAQ；1440/390 |
| A | [Accessories](https://www.lymow.com/collections/accessories) | 筛选、产品卡、双端网格；1440/390 |
| B | [About Us](https://www.lymow.com/pages/about-us) | 品牌叙事、使命卡、时间线与照片轮播；1440/390 |
| C | [Return & Refund Policy](https://www.lymow.com/pages/return-refund-policy) | 普通内容排版、窄正文、表格与Footer；1440/390；只研究样式，不提供政策解读 |

产品介绍及卖点展示已由P-A/P-B的长篇故事区覆盖；没有虚构额外独立产品介绍URL。FAQ以站内PDP与活动页模块为样本；未将站外Zendesk Help Center混为同一主题。

### 公开CSS来源

- [theme.css，当前取证版本](https://www.lymow.com/cdn/shop/t/82/assets/theme.css?v=23411394580410743171792738986)：基础排版、button、container、product-card、accordion、footer及基础断点。
- [layout.css，当前取证版本](https://www.lymow.com/cdn/shop/t/82/assets/layout.css?v=179213088484329206821785985874)：Lymow两级容器、12/40/80px内边距、文字渐变。
- [lymow-purchase-studio.css，当前取证版本](https://www.lymow.com/cdn/shop/t/82/assets/lymow-purchase-studio.css?v=168519178214141125871793070220)：P-B独立购买区、套餐、图库、sticky及900/600断点。
- H/P/M公开HTML内的`<style>`：字体文件、主题root变量、具体section设置和覆盖；本文组件选择器用于定位，不要求复制动态ID。
- 公开渲染HTML内的JS：相关视频lazy触发与DOM行为。仅据此描述已观察实现，不声称审查了全部前端脚本。

### 可信度与边界

- **强证据：** 实际字体文件、root变量、字号覆盖、容器、列数与间隔、圆角、CTA尺寸、主要媒体切换素材、所列CSS过渡参数。
- **视觉归纳：** 黑底叙事 / 白底购买的分工、技术图与场景图交替、摄影角度、信息密度、CTA分布。
- **推导建议：** 新模块的主体占比与文案安全区、重建骨架、未知状态的无障碍补充、长表格处理；均非原站精确值。
- **未获取：** 原始Liquid、section schema/settings源文件、主题编辑器配置、完整构建工程；工作区取证开始时无主题源码。无Shopify后台或线上主题修改。
- **未验证：** 真实结账、库存耗尽与错误态、全部抽屉分支、所有语言 / 市场、全部平板页面、全站性能指标与辅助技术完整审计。不要把本文件称作上述方面的认证。
- **当前最薄弱处：** P-A/P-B的路由与版本选择机制尚不清楚；P-B叠加覆盖多，状态与模板后续变动需重新核实。活动会变化，不能把M中的视觉皮肤当作长期基线。没有原始主题时只能指导视觉重建，无法保证复用组件的内部API。

后续若获得与线上一致的主题源码，优先补足：组件可复用入口、schema/settings映射、字体与token单一来源、真实hover/disabled/error状态及模板选择机制；本公开包的核心视觉规则保留于随包分发的references/design-system.md，主Skill明确要求实现前读取；不依赖包外的私人文件。
