## 4. Design Tokens

### 4.1 Typography：先选样式角色，再选语义标签

字体为 **`"Open Sans", sans-serif`**。[C/R] 公开 `@font-face` 包含 400、600、700 及对应 italic；正文默认 400，标题基础 600，按钮 / 加粗文字多为 700。部分活动模块写成 `OpenSans`（无空格），不能据此创建第二品牌字体；应核实加载或回退，新增模块使用已验证名称。

已观察的字体文件（不是要求跨项目永久热链）：

- 400：[opensans_n4.woff2](https://www.lymow.com/cdn/fonts/open_sans/opensans_n4.c32e4d4eca5273f6d4ee95ddf54b5bbb75fc9b61.woff2)
- 600：[opensans_n6.woff2](https://www.lymow.com/cdn/fonts/open_sans/opensans_n6.15aeff3c913c3fe570c19cdfeed14ce10d09fb08.woff2)
- 700：[opensans_n7.woff2](https://www.lymow.com/cdn/fonts/open_sans/opensans_n7.a9393be1574ea8606c68f4441806b2711d0d13e4.woff2)

优先用主题已加载字体，不重复注入；独立原型使用可访问的同字体文件。字体加载失败必须检查，不能仅凭 computed `font-family` 声明认定实际字体正确。本站英文样本没有验证CJK字形；中文新页面保留英文品牌字体，同时明确所选中文fallback并重新检查行长，不能声称Open Sans包含中文字形。

**主题基础排版 [C/R]，1440px / 390px；不是所有模块的最终字号：**

| 角色 / 变量 | Desktop | Mobile | line-height | weight / tracking |
|---|---:|---:|---:|---|
| H0 `--text-h0` | 80px | 48px | 1 | 600 / -0.02em |
| H1 `--text-h1` | 64px | 40px | 1.1 | 600 / -0.02em |
| H2 `--text-h2` | 58px | 32px | 1.1 | 600 / -0.02em |
| H3 `--text-h3` | 36px | 24px | 1.2 | 600 / -0.02em |
| H4 `--text-h4` | 32px | 22px | 1.3 | 600 / -0.02em |
| H5 / H6 | 24 / 20px | 18 / 16px | 1.4 | 600 / -0.02em |
| Body `--text-base` | 16px | 14px | 1.6 | 400 / 0 |
| Small `--text-sm` | 14px | 12px | 1.6 | 400 / 0 |
| Caption `--text-xs` | 12px | 11px | 1.7 | 400 / 0 |

**实际组件覆盖值 [C/R]，优先于上表：**

| 组件角色 | Desktop | Mobile | 其他 |
|---|---|---|---|
| 首页章节 `.section-heading__title` | 48px / 52.8px | 32px / 40px | 600；-2px；下间距 24 / 15px |
| PDP 故事普通标题 | 40px / 44px | 28px / 35px | 600；-2px |
| PDP `.small` 标题 | 40px / 55px | 28px / 38.5px | 名称 small 不代表所有小标题 |
| PDP 场景 Banner `.banner-title` | 58px / 78.88px | 32px / 43.52px | 600；手机单独控制换行 |
| 故事说明 `.section-heading__description` | 16px / 22px | 14px / 19.25px | 白色 60% alpha |
| P-A 购买标题 `.product-info__title.h2` | 58px / 63.8px | 32px / 35.2px | 原生模板 |
| P-B 购买标题 `.lps__intro h1` | 36px / 39.6px；700 | 31px / 34.1px；600 | -0.045em；不可与 P-A 混搭 |
| 首页新闻卡标题 | 24px / 27px | 16px / 18px | 600 |
| PDP 三列技术卡标题 / 描述 | 16px / 16px；12px / 19.2px | 同字号 | 标题 -0.85px，正文白 60% |
| 服务权益卡标题 | 16px / 22px | 14px / 19.25px | 600 |

**换行规则：** 英文标题按语义短语分行，桌面通常 1–2 行，手机可为 2–3 行。[V] 官网存在 desktop/mobile 两份文字 span，不只是自动折行。正文居中标题组多采用约 **571–580px** 窄栏。[R: P] 不要给所有 H2 强设该宽度；媒体标题、长内容页、购买标题各有容器。新文案先用匹配字号和容器试排，再调整语义换行，不用缩小字号挤字。[I]

### 4.2 Colors

| Token / 角色 | 已验证值 | 适用范围 |
|---|---|---|
| `--button-background-primary/secondary` | `4 195 116` → **#04C374** | 主题商务 CTA；P-B `--lps-accent` 同值 [C/R] |
| `--button-text-primary/secondary` | `255 255 255` | 绿色 CTA 的白字 [C] |
| `--background-primary` / `--footer-background` | `0 0 0` | 故事、集合背景和 Footer [C/R] |
| 浅色购买 / 内容 surface | **#FFFFFF** | PDP、政策；不是全站背景 [R] |
| `--text-primary` | `255 255 255` | 深色默认；浅色区局部覆盖黑色 [C/R] |
| `.product-card` 文字 | **#1A1A1A** | 白色产品卡 [R] |
| 故事说明文字 | `rgba(255,255,255,.6)` | 黑底相当于 #999；不是任何底色都用 #999 [C/R] |
| 次级卖点文字 | **#888888** | 首页卖点描述 [C] |
| 深色 surface | **#191919** / **#272727** | 首页展开项 / PDP 技术卡 [C] |
| `--border-color` | `255 255 255 / .12` | 黑底细分隔线 [C] |
| `--on-sale-badge-background` | `248 58 58` → **#F83A3A** | 主题折扣 badge；个别模板价格另有红色 [C] |
| P-B 促销价格 | **#E31E24** | `.is-sale` 覆盖；不建立全站红色规范 [C] |
| 活动 gold / cream | 必须取目标活动局部 CSS | 仅 Campaign；不得覆盖品牌主色 |

没有验证出独立、跨页面通用的 Secondary 品牌色或统一 disabled 填充色。**不要补造**。主题实心CTA在精细指针hover时变为透明底＋原按钮色文字/描边，不是另一个深绿色；独立组件按自身状态实现。无现成可用状态时遵循本文件标记为 [I] 的无障碍建议。

### 4.3 Layout & Spacing

存在两套并行容器。[C/R] **不能全站统一成 `max-width:1200px; padding:24px`。**

| 容器 | 规则 | 1440px 实测内容宽 | 390px 实测内容宽 |
|---|---|---:|---:|
| 主题 `.container` | max 1400；gutter 48 / 20；768px 时 32 | 1344px，x=48 | 350px，x=20 |
| `.lymow-page-container` | 外框 max 1560，内 padding 80；≤768 为 12 | 1280px，x=80 | 366px，x=12 |
| `.section-container` | 外框 max 1360 = 1200+2×80；769–1024 padding 40；≤768 padding 12 | 1200px，x=120 | 366px，x=12 |
| 政策阅读栏 | 主题容器内窄排版 | 约 731.88px，x≈354 | 350px |

`.section .section-container` 在线有清除内边距的覆盖；复用时检查祖先链，避免双重 padding。1920px 时主题内容封顶 1400、故事容器内容封顶 1200，不能让正文无限拉宽。[C/R]

- 定制主章节常见上方 **120px / 60px**；平板有 **100px**。部分标题与内容分属相邻 Shopify sections，必须按视觉组计算总间距。[C]
- 独立模块的结束留白按下一段边界判断：[I] 同底色连续叙事避免上段bottom与下段top重复累加；转场到不同底色时可以保留结束留白，但需在组合页面检查。120/60是已观察的主章节起始节奏，不是所有模块上下必须同时使用的值。
- 主题 `--section-outer-spacing-block` 为 **96px / 48px**，与定制章节不相同；`--section-stack-spacing-block` 为 48 / 32px。[C/R]
- 常见组件 gap：双栏 40px；技术三卡 30px；商品列 24px；移动集合 8px；按钮并排 16px。[C/R]
- 以内容家族选择间距；不要建立强制“所有尺寸都只能是 8 的倍数”的新规则。

### 4.4 Shape & Effects

| 对象 | 精确值 / 范围 | 说明 |
|---|---|---|
| 主题 button | radius **60px** | `--rounded-button:3.75rem` [C/R] |
| 通用圆角 | 4 / 8 / 16px；input 8px | `--rounded-sm / --rounded / --rounded-lg` [C] |
| 商品卡 | **4px** | 白卡，非大圆角 Bento [R] |
| PDP 技术卡 / 大媒体 | **18px / 手机9px** | 指定故事组件 [C/R] |
| 首页卖点媒体 | 外层 8px、内层12px；手机6px | 不把嵌套圆角复制到所有图片 [C] |
| 首页展开项 | **28px**；闭合按钮高56px | 胶囊到信息块的切换 [C] |
| 描边 | 通用细线1px；outline button内描边2px | 状态轮廓不要只靠阴影 [C] |
| 阴影 | 内容卡通常无；图库切换等局部存在 | 不建立通用 elevated-card token [V/C] |
| 过渡 | CTA `.15s ease-in-out`；Tab `.25s ease`；卖点 `.3–.4s ease-out` | 按组件选取 [C] |
| 内容入场 | `opacity` + `translateY(40px)`；`.8s ease-out` | `.fade-in-up`，仅指定元素 [C] |

**允许的文字渐变 [C，来自 layout.css]：**

```css
/* 仅用于深色技术标题；不是整页背景 */
.ly-metal-text {
  display: inline-block;
  background: linear-gradient(37.799905062840466deg, #fff, #7e848f 70%, #ccc);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  padding-bottom: .15em;
  padding-right: 2px;
}
```

**间距计量 [C/R，二次测试澄清]：** 故事标题下24/15px指CSS盒之间的margin，不是字形墨迹间距，也不含渐变标题自身`.15em`底padding。不要将24减6或15减4.2作为新margin。普通章节应只用一侧margin或明确的gap，避免默认p margin叠加。数字指标清除padding的例外不适用于普通渐变标题。

半透明遮罩没有经核验的全站统一 opacity。优先使用已完成调色、为文案留空的原图；确需遮罩时继承目标 section 的设置，或标注为新模块建议并进行可读性验证。

## 5. Layout & Typography：快速决策

| 新内容 | 采用的基础 |
|---|---|
| 首页新增品牌 / 证据章节 | 黑底；首页48/32标题；1200或1400内容容器；真实媒体 |
| 产品技术卖点 | 黑底；40/28标题；16/14说明；窄标题组＋大媒体；120/60节奏 |
| 购买区 | 白底；先确定 P-A 或 P-B 模板；沿用其变体与 CTA |
| 配件列表 | 黑底白卡；主题容器；桌面3列＋侧栏 / 手机2列 |
| 政策 / 普通文章 | 白底黑字；主题 H1/H3；约732px阅读栏 |
| 促销页 | 品牌字体与组件基础＋有作用域的活动 palette；金色不是默认 |

语义 H1/H2/H3 与视觉字号解耦；每页保留清楚的标题层级。不要因为源码某个组件用了 H2 就将其字号套到全站 H2。新增模块的类名应有作用域，不能复制现场 `template--…` ID 或全局覆盖 `.section-heading__title`。

## 6. Component Recipes

### 6.1 Header / Announcement / Footer

**来源 H/P/A/C，`.header__wrapper`、`.footer__block-list`。[C/R/V]**

- Desktop：Logo 左，主导航中间，地区 / 搜索 / 账户 / 购物车右；1440 时 Header padding `24px 48px`，高度约73.6px（不含公告）。实测 Logo 显示宽120px。摄影首页使用透明叠图、白色元素；PDP / 集合 / 政策使用白底黑字。
- Mobile：汉堡与搜索在左，Logo居中，购物车右；padding `12px 20px`，高46px。使用菜单抽屉，不把桌面链接挤成两行。
- 主题导航使用自身 700/1000/1150 等断点，不强行套用故事模块的768断点。叠图、滚动后的实底与 sticky 偏移要复用原 Header 行为。
- 当前公告栏是活动内容：桌面约40px，手机因换行约65.8px。**这些是当时内容高度，不是长期固定 token**；锚点偏移不能硬编码为114px。
- Footer 黑底；桌面订阅块＋四组链接；手机订阅占整行，链接保留两列，不是全部折叠 accordion。社交图标、低对比宽 Logo 收尾；沿用真实 Logo，禁止用文字描字间距重造。

### 6.2 Hero / Full-width Media

**来源 H/P/M，`.slideshow`、`.banner-section`、`.banner-title`。[C/R/V]**

- 首页 Hero 可作为轮播：场景和人物通常位于右侧或下部，文案占左侧安全区；普通产品故事 Banner 则常将白色短标题居中叠图。
- 宽媒体负责建立场景；后续解释回到限宽容器。不要把所有媒体都放入小卡，也不要让正文跟随全宽。
- 产品故事 Banner 使用58/32字号；手机可以改变换行并调用专用素材。活动 Hero 当前1440宽高约600px、390宽高520px；该比例只约束这套素材，不可推广为全站Hero高度。
- 已验证活动实际切图：`2026BFCM_PC_copy.png` → `2026BFCM_MOB_copy.png`；桌面 `cover`，手机该图为 `contain`。这说明必须逐素材决定裁切，不能一律 `cover`。
- 深色普通Hero可用白底黑字胶囊CTA；商品购买CTA用绿。保持图片上产品轮廓和字的对比，不能以遮罩抹掉履带细节。

### 6.3 Button

**来源 P-A / H，`.button`、`.button--xl`、`.button--outline`。[C/R]**

- Primary 商务按钮：`#04C374` + 白字；font-weight700；line-height1.6；radius60px。XL桌面16px、padding `17.2px 40px`，约60px高；手机14px、`16px 32px`，约54.4px高。
- 基础按钮桌面14px、`12px 24px`；手机12px、`10px 20px`。选用已有尺寸变体，不将它们混成单个全站高度。
- 主题命名 `button--secondary` 的实际背景仍可为绿；“secondary”不等于灰底。弱操作按实际上下文用白底、outline或文本链接。
- Outline 使用2px inset轮廓；文案型链接可带细下划线。不要为每个弱链接加图标。
- 已验证原生主题在 `(pointer:fine)` 下：实心按钮hover为透明底、`#04C374`文字、`inset 0 0 0 2px currentColor`；outline则反向变实心。transition `.15s ease-in-out`。本规则不自动覆盖P-B `.lps` 等独立按钮。
- `.circle-button[disabled]` 的 opacity=.5；PDP技术卡轮播 disabled=.3，两者不可合并。普通CTA无可核验的统一disabled palette；建议 `disabled` 原生语义＋清楚弱化，具体值标为 [I]。
- [I] 新建控件保留清楚的 `:focus-visible`，小图标扩展可点击面积至约44px。不强制把所有CTA拉满：购买区 / 底部操作可全宽，Hero CTA通常内容自适应。


**无现成主题组件时的CTA重建示例 [I，已验证视觉参数]：** 用链接执行导航、button执行动作。下面仅实现视觉，不绑定购物车；禁止用演示按钮假装已完成购买功能。

```css
.ly-cta { display:inline-block; border:0; border-radius:60px;
  background:#04c374; color:#fff; padding:17.2px 40px;
  font:700 16px/1.6 "Open Sans",sans-serif; text-align:center;
  text-decoration:none; cursor:pointer;
  transition:background-color .15s ease-in-out,color .15s ease-in-out,
    box-shadow .15s ease-in-out; }
@media (pointer:fine) {
  .ly-cta:not(:disabled):hover { background:transparent; color:#04c374;
    box-shadow:inset 0 0 0 2px currentColor; }
}
@media (max-width:699px) {
  .ly-cta { font-size:14px; padding:16px 32px; }
}
/* 以下focus/disabled为补充建议，不宣称官网统一状态 */
.ly-cta:focus-visible { outline:2px solid currentColor; outline-offset:4px; }
.ly-cta:disabled { opacity:.5; cursor:not-allowed; }
```

### 6.4 Section Heading + Media / 指标双栏

**来源 P-A/P-B，`.section-heading`、`.shopify-section--left-right-column`。[C/R/V]**

- 章节上方120px / 手机60px；居中40/28标题、最多约580px的16/14说明；标题下24/15px。本指标模块标题组至下方双栏间距为60px / 手机30px；别把正文叠到草坪细节上。
- 指标双栏：可用宽1200容器；CSS左38%、右62%、gap40px；flex收缩后1440实测约440.8/719.2px。**38/62是扣除间隔后的比例意图，不是两个百分比再加40px强行溢出。**
- 左侧指标竖排，value40px、label16px白70%；上下组gap40px；右侧媒体保持比例、radius18px。
- 手机：标题组居中；指标横排，value24px、label14px；下方媒体全宽，gap40px、radius9px。此参考模块并非“桌面左标题右图片”——标题在整个双栏上方。
- 图片与数字必须描述同一能力。不存在性能数字时改用普通图文，不编造两项数字来凑版式。[I]

**以下是按规则重建的独立示例，不是提取的 Liquid；类名和API均为新建。** 复用主题时只移植必要规则，字体来自宿主。`MEDIA_URL`、文案、参数必须由业务输入替换。

```html
<section class="ly-feature" aria-labelledby="feature-title">
  <div class="ly-feature__container">
    <header class="ly-feature__heading">
      <h2 id="feature-title" class="ly-metal-text">已确认的产品能力标题</h2>
      <p>用一段简短说明解释这项能力如何改善真实作业。</p>
    </header>
    <div class="ly-feature__row">
      <dl class="ly-feature__metrics">
        <div><dt>指标名称一</dt><dd class="ly-metal-text">已验证值</dd></div>
        <div><dt>指标名称二</dt><dd class="ly-metal-text">已验证值</dd></div>
      </dl>
      <img class="ly-feature__media" src="MEDIA_URL" width="1600" height="900"
           alt="与标题对应的真实产品作业场景" loading="lazy">
    </div>
  </div>
</section>
```

```css
/* [I] 重建骨架；数字来自本节C/R。媒体16:9适用于该示例素材。 */
.ly-feature, .ly-feature * { box-sizing: border-box; }
.ly-feature { background:#000; color:#fff; font-family:"Open Sans",sans-serif;
  padding:120px 0 0; }
.ly-feature__container { max-width:1360px; padding:0 80px; margin:auto; }
.ly-feature__heading { max-width:580px; margin:0 auto 60px; text-align:center; }
.ly-feature__heading h2 { font-size:40px; font-weight:600; line-height:1.1;
  letter-spacing:-2px; margin:0 0 24px; }
.ly-feature__heading p { color:rgb(255 255 255 / .6); font-size:16px;
  line-height:1.375; margin:0; }
.ly-feature__row { display:grid; grid-template-columns:minmax(0,38fr) minmax(0,62fr);
  align-items:center; gap:40px; }
.ly-feature__metrics { display:grid; gap:40px; margin:0; }
.ly-feature__metrics > div { display:flex; flex-direction:column; gap:6px; }
.ly-feature__metrics dt { order:2; color:rgb(255 255 255 / .7);
  font-size:16px; line-height:1.375; }
.ly-feature__metrics dd { order:1; margin:0; font-size:40px; line-height:1;
  font-weight:600; }
.ly-feature__metrics dd.ly-metal-text { padding:0; }
.ly-feature__media { display:block; width:100%; height:auto; aspect-ratio:16/9;
  object-fit:cover; border-radius:18px; }
@media (min-width:769px) and (max-width:1024px) {
  .ly-feature { padding-top:100px; }
  .ly-feature__container { padding-inline:40px; }
}
@media (max-width:768px) {
  .ly-feature { padding-top:60px; }
  .ly-feature__container { padding-inline:12px; }
  .ly-feature__heading { margin-bottom:30px; }
  .ly-feature__heading h2 { font-size:28px; line-height:1.25; margin-bottom:15px; }
  .ly-feature__heading p { font-size:14px; }
  .ly-feature__row { grid-template-columns:minmax(0,1fr); }
  .ly-feature__metrics { display:flex; flex-wrap:wrap; gap:25px; }
  .ly-feature__metrics dd { font-size:24px; }
  .ly-feature__metrics dt { font-size:14px; }
  .ly-feature__media { border-radius:9px; }
}
```

指标也使用灰阶渐变，但清除通用文字渐变的额外padding，避免指标组变高。媒体素材不是16:9时，按本次素材与参考组件调整，不能强制裁掉硬件。示例不添加CTA，因为这个官网模块依靠产品页的统一购买入口；需要独立营销入口时在明确的内容结尾复用Button规范。[I]

**相邻职责的组件例外 [R，第二阶段P-B气流双视频复查]：** `.shopify-section--video-split-hover` 本身padding为桌面70px、390/768为35px（上下）；其媒体桌面约1400px宽，390媒体366px但标题组334px。768还存在说明字号18.432px、标题下23.04px等局部clamp覆盖。它和上方指标配方不是同一个组件；不要把120/60、580/366或14px正文直接宣称为全部故事section实测值。新主章节仍可采用前述配方，但与气流双视频比较时须如实记录留白和媒体占比差异。

### 6.5 首页卖点切换 / Tabs / Carousel

**来源 H，`.lymow-selling-points`、`.ugc-action-videos__tab`。[C/R/V]**

- 首页卖点：桌面左侧可展开深灰项目＋右侧大媒体；展开内容宽423px、padding28px、描述16px #888；闭合项18px、高56px、radius28px。媒体区域800×510px（1440/1920样本）；不要用四个等宽小卡替代。
- 手机隐藏左Tab列表，改为横向媒体卡流，约1.3张可见、gap20px；390样本单卡约277px。媒体后跟编号横线、16px/700标题、14px描述。不是四卡竖排。[R/V]
- 卖点切换：opacity＋横移20px，进入`.4s ease-out`；按钮轻微 hover scale1.01、按压.99；这是已存在的局部微动效，不是允许全站缩放。[C]
- 作业视频Tabs使用另一套形态：横向文字标签、选中白字与底部细线，未选中 #666；不是胶囊。1440时Tab字号15px、移动约14.56px；实际值来自按设计宽度换算的CSS。
- Tab保持单行横向滚动，选中项进入可见区；视频组随选择变化。390时可见一个主视频卡和前后箭头；不要把全部视频自动播放。
- Carousel必须保留滑动 / 下一张入口、边界disabled、当前项状态；不要让用户只能靠hover获取信息。

### 6.6 技术卡 / Bento / 服务卡

**来源 P/H，`.ai-three-column-*`、`#image_with_text_overlay_product`、`.features-grid-home-*`。[C/V]**

- 三列技术卡：max1000px、gap30px、#272727、radius18px；顶部图片横向铺满，下方16px标题＋12px说明，文字左右16px、正文下24px。不要额外加阴影或彩色边框。
- `≤989px` 改为横向轮播，单卡75vw、radius9px、箭头40px；不是统一768断点。
- PDP卖点总览使用大小不等的图片网格：主技术卡更大、辅助能力较小，标题置于图片上；用真实产品图与短标签，不能把它改成SaaS图标矩阵。
- 首页服务区是独立图像化Bento：中央大图与周围服务卡、深灰章节背景；绿色综合图像是素材中的视觉，不应给所有卡片套绿色渐变。
- 新建Bento应依据素材可读性选择跨列比例；原站不是全站统一Bento系统。[I]

### 6.7 Product Card / Collection

**来源 A，`.product-card`、`.product-list`。[C/R/V]**

- 黑色页面、白色商品卡、黑灰字；图片方形区域，干净白背景，不裁掉配件。Card radius4px；商品标题和价格在图片下方左对齐。
- 1440：48px页面边距；侧栏300px；侧栏到商品区48px；商品区三列，每列316px、横gap24px、行gap48px。
- 390：20px边距；两列171px、横纵gap8px；筛选变为抽屉入口。不要手机一列大卡或保留300px侧栏。
- 折扣badge位于图上、优惠价与原价清晰区分；库存与价格使用Shopify数据，不写死调研时价格。
- 部分卡有第二张图hover切换，只有素材存在时启用；手机不能依赖hover。商品卡与技术卡是不同组件，不共用18px圆角。

### 6.8 PDP：两个真实购买模板，必须二选一

**P-A**：`/products/lymow-one-plus-robotic-lawn-mower`，`.product-gallery` / `.product-info`。

- 1440：白底，左右各648px、gap48px，页面gutter48px；左图库内64px缩略图列＋48px间隔＋536px主图。右侧标题、价格、说明、变体、数量与CTA。
- 手机：图库在前、点状分页、Gallery/Video胶囊，再是左对齐标题与购买信息；同一模板真实标题32px，**不是P-B的31px**。
- Buy buttons并排时各占可用空间，底部sticky CTA另有移动布局。变体选中轮廓、价格同步、库存禁用、图库放大与购买事件应复用，不能只做外观。

**P-B**：`/products/lymow-one-plus-robot-lawn-mower`，`.lps`，公开资源 `lymow-purchase-studio.css/js`。

- 桌面 `grid-template-columns:minmax(0,1fr) 490px`；1440时图库区950px、配置区490px。图片热点、横缩略图、Photos/Videos切换；配置区居中标题和指标、套餐卡与扩展选项。
- `≤900px` 为纵向布局；图库padding `6px 16px 17px`；主图区最终有1:1规则；标题31px；套餐保留展开选择，不压成一个select。
- 套餐卡默认1px `#CBD5D8`边框、radius10px、白底；选中2px `#04C374`边框＋`#EFF7F1`底。精确状态继承 `.lps` CSS，不由 `.product-info` 套用。
- 底部购买栏桌面最终fixed高107px，手机最终 `96px + env(safe-area-inset-bottom)`；有对应页面留白补偿。该值来自后置覆盖，不是CSS前部的76/90px规则。[C]

首次取证曾从P-A跳转到P-B；随后分别直接访问并在同一会话切换1440/390，两个模板均存在。**跳转触发机制未确认**，不得宣称P-B只属于手机、A/B测试已证实，或新建无授权跳转。新项目沿用目标主题选定的模板。

### 6.9 FAQ / Comparison / 普通内容

**来源 P/M/C。[C/R/V]**

- P-A FAQ：黑底、居中40/28标题；细分隔线，`details.accordion > summary`，左右问句 / 加号；toggle上下padding20px。桌面问答区实测约710px；手机因内层padding实际约302px，不能简单等同366px故事容器。
- 普通回答用16/14正文；展开要改变内容高度与状态，不用覆盖式tooltip代替。上下边框1px，相邻行不重复叠加。
- 活动FAQ为米白背景和金色圆形加号，属于活动皮肤；不要复制到普通技术页。
- 产品比较：PDP有材料结构视觉对照与规格表，P-B有套餐比较入口。两者不等于已建立全站“竞品比较组件”；无证据时不得输出虚构竞品优劣。
- 政策内容：白底黑字、H1 64/40居中，正文约732/350px、16/14字号；H3 36/24。表格细描边，段落左对齐。新表格手机必要时局部横滚，不以极小字号硬塞。[I]

### 6.10 常规营销：先选职责，再选版式

无折扣的产品探索、内容导流同样属于营销，不需要补造优惠机制。不要因为没有活动皮肤，就自动组合“白底＋左文右图＋绿色按钮”；这些单个tokens正确也可能形成通用模板。[I，第二阶段测试所得]

- **场景引流 / 主视觉入口：** 优先参考H的One Plus或Real Yards场景Hero：真实大画面承载信息，桌面文案偏左、产品留在另一侧；手机按具体slide改为上方或中央文案，使用手机素材或重新规划焦点。深色场景通常白底黑字CTA。不得将背景颜色、CTA单独从白底购买区拼入，却声称还原同一Hero。[V/I]
- **页面中段的内容 / 商品引流：** 可选择现有同职责的图文模块或卡片；如果改为白底双栏，必须说明参考来源和新的构图推导。白底不是禁用，也不因一次测试改成全站禁用。[I]
- **已复查的H / One Plus Hero覆盖值 [R，1440 / 768 / 390]：** 标题58/40/32px，line-height81.2/56/44.8px，700，字距-.02em；说明20/18/16px、line-height1.4、字重400/600/600。此处700与§4普通章节600并存，不可用首页章节48/32规则替代。CTA沿用XL，桌面/768约60px、390约54.4px、radius60px；本slide为白底黑字。不是所有Hero都强制这组值。
- H该slide桌面使用宽图、390使用独立竖图；桌面文案边界约100px，390为20px。不可把100px认作主题container新token。原图带有标识时保留其事实来源；不复制图片里的奖项/质保/优惠到新文案，无法确认适用性时另选干净的官方场景媒体。[R/I]
- **新营销编排 [I]：** 一条核心标题、一段短说明、一个主要CTA；测试声明清楚可见，但放到独立注释区，避免挤占主要标题—CTA—产品的视觉链。普通探索无需eyebrow、说明、角标、脚注、caption同时出现。图库/视频poster可作为真实素材，但不能仅因内容真实就视为合格营销主图。
- 768必须单独确认所选组件的实际断点与字体覆盖；找不到同类证据时允许局部推导并标[I]，不得静默增加一套“Lymow平板标准”。

## 7. Page Patterns

| 页面类型 | 推荐组织方式（不强制顺序） | CTA与移动处理 |
|---|---|---|
| Homepage | Hero → 核心技术 / 证据 → 作业视频 / 用户内容 → 服务保障 → 新闻 → Footer | Hero主行动；深色章节保持节奏；手机卖点与视频改横滑 |
| 产品故事 / 卖点页 | 能力概览 → 全宽场景章节 → 窄标题说明＋大媒体 → 指标 / 工程细节 → 真实结果 → 规格 / FAQ | 统一产品锚点 / sticky购买入口；不要每段重复按钮 |
| PDP | 白底购买区 → 黑色能力总览与故事 → 规格 / 包装 / FAQ / 评价 | 先确定P-A/P-B；购买参数、价格、图库状态保持同源 |
| 常规营销 / 无优惠引流 | 按§6.10选择场景入口或中段内容引流；标题＋短说明＋真实媒体＋CTA | 继承所选模块的背景、字体角色、CTA与手机顺序；不强造活动机制 |
| Campaign | 活动Hero → 优惠机制 → 商品选择 → 场景证据 / 评价 → 活动FAQ | 皮肤局部作用域；弱化无关复杂叙事；条款、有效期与优惠数据独立配置 |
| 普通内容 | 清楚标题 → 窄栏连续内容 / 表格 → 相关入口 → Footer | 阅读优先；不强塞Hero、轮播或黑底技术卡 |
| About / 品牌故事 | 实景或工程图开场 → Mission/Vision → 时间线 → 真实活动图片 | 手机使命卡堆叠；时间线仍保持图像与事件并列，而非统一改成全宽大图 |

用全宽场景图转换叙事，用限宽媒体解释功能，用小卡并列子证据；三者必须有层级。活动金色背景不能因它在首页第一屏出现就覆盖产品故事的黑色体系。

## 8. Imagery & Motion

### 8.1 Art Direction

- **产品摄影：** 黑 / 银灰的真实履带机身，常见前方三分之四角度与略低视点，保持轮廓、接地和材质。购买图通常白底整机，不加装饰投影；若原素材自带自然阴影则保留。[V]
- **作业画面：** 庭院、坡地、树荫、复杂地表和草屑，呈现真实尺度；草坪作为环境而不是纯绿背景板。自然日光与真实阴影为主，机身清楚；不能整体调成荧光绿。[V]
- **人物：** 用户生活 / 用户证据图可有人物，产品与庭院仍有明确关系；人物不是每段必备的广告模特。[V]
- **工程素材：** 刀盘、气流、机架剖面可用受产品资料约束的CG或示意；这不授权新增不真实机械结构或不受支持的功能。[V/I]
- **构图比例是建议，不是CSS事实 [I]：** 白底主图可让机身占画面宽约65–80%；环境证据图可从15–40%起步以保留坡度 / 庭院上下文；硬件细节图允许占比更大。原站素材存在明显差异，必须以目标参考与素材为准，不能逐张强制相同比例。
- **文案安全区 [I]：** 左文右物Hero优先留约35–45%横向低复杂度区域；手机改为上文下物或专用竖构图。不要将这些百分比标为测得的全站标准。
- 避免：白底配件被强制裁边、以手机裁切丢失刀盘 / 履带、错误影子方向、虚构人物评价、无授权认证Logo、饱和度拉满的通用图库图。

### 8.2 Asset Handling

使用真正的desktop/mobile素材对，或先验证同图在两端的焦点。`object-fit:cover`用于需要铺满的场景；`contain`或自然比例用于完整展示硬件。官网某方图computed为`fill`仅因图片和框同为正方形，不能据此拉伸其他比例素材。

**媒体清晰度 [I，第二阶段测试所得]：** 记录素材真实像素尺寸与最大渲染宽度，并按目标DPR检查。800px视频poster放大到1200px桌面媒体会变软，不能因URL来自官网就跳过检查。优先从同一已确认素材取得原图/更大版本；检查实际返回尺寸（URL写1600并不保证返回1600），srcset的w描述符必须写真实宽度。以最大CSS宽×目标DPR选资源；原始素材不足时明确清晰度限制，按内容职责收窄媒体、换已验证官方素材或使用真实视频，不能AI补造细节，也不声称已满足2x清晰度。

开发时为媒体显式给出 `width/height` 或 `aspect-ratio`，提供合理 `srcset/sizes`；首屏关键图优先加载，非首屏lazy；不把全页视频一次加载。官网相关视频使用 `muted/playsinline/loop`、poster、`preload=none`，并通过IntersectionObserver提前约200px触发播放。[C] 第三方用户视频是点击播放入口，不应强制自动有声播放。

### 8.3 Motion

优先复用轻量淡入、40px上移、简短Tab切换、轮播。不要增加滚动劫持、大幅视差、设备3D旋转或复杂页面转场。[C/V]

[I] 新组件必须在JS失败时仍可见，不能默认`opacity:0`导致整页消失。为 `prefers-reduced-motion:reduce` 关闭入场平移、非必要自动轮播与滚动动画，保持最终可读状态。不要复制某页面未统一覆盖的无障碍缺口。

## 9. Responsive Rules

| 规则家族 | 已发现断点 [C] | 应采取的动作 |
|---|---|---|
| 主题基础 | min700 / 1000 / 1150 / 1400 / 1600px | 保留主题自身容器、导航和排版规则 |
| 定制故事与layout.css | max768；769–1024；部分min1300 | 改边距、标题、图文堆叠与媒体结构 |
| PDP三列技术卡 | max989 | 改75vw横向轮播 |
| P-B购买区 | max900；弹层另有max600与max390 | 配置纵排、底部操作与弹层适配 |

1. Desktop1440、Mobile390为必检视口；再查768与1920，必要时补断点两侧。不要用单一断点覆盖全部组件。
2. 首页标题采用真实clamp时：desktop `clamp(24px,4vw,48px)`，≤768 `clamp(32px,6.4vw,64px)`；768实测约49.152px。它不是简单48→32线性缩放，也不是所有PDP的规则。新模块如需更平顺的平板字号，必须标为[I]调整，不能宣称原站原值。
3. 移动标题按语义换行；主体内容、性能数字和CTA不应被隐藏，仅可改变表达或折叠结构。
4. 配件2列、技术卡横滑、故事指标横排、普通长内容纵排是不同模式；禁止统一“全部一列”。
5. Footer两列链接；Header抽屉；Tabs单行横滚。检查触摸横滑时不导致整页横向溢出。
6. 仅局部媒体 / 表格 / 轮播允许横滚；页面本身不得横向滚动。宽表格不要压缩成不可读文字。
7. Sticky CTA考虑实际Header / 公告高度、底部safe area、客服浮层、cookie弹窗和页面留白，不能遮住选项或正文。使用宿主已有定位系统，避免复制P-B巨大的z-index到新组件。

## 10. Do / Don't

| Do | Don't |
|---|---|
| 黑底＋灰阶标题＋真实割草大图 | 用蓝紫渐变、玻璃卡拼“科技感” |
| Open Sans并检查真实加载 | 随手换Inter、Roboto或系统默认字体 |
| 按页面家族选40/28或48/32标题 | 给所有H2统一一个字号 |
| CTA用绿，场景绿色由素材提供 | 满屏绿色背景、绿色阴影和绿色正文 |
| 保留1200/1400两层容器及12/20移动边距 | 全站套一个1200＋24px的通用模板 |
| 复用购买模板完整状态 | 拼接P-A图库与P-B套餐样式却丢失行为 |
| 桌面宽图＋手机专用构图 | 用同一张横图强裁所有移动Hero |
| 活动样式限定在活动作用域 | 将黑五金色、红角标和抽奖继承到所有页面 |
| 使用真实参数与业务文案 | 为排版凑数字、徽章、评价、赠品 |
