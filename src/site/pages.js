const studio = 'https://aipickgold.com/aipickgold-studio/';
const firstLesson = `${studio}tutorial/01-codex-intro.html`;
const stages = [
  { id: 'begin', number: '01', label: '建立基础', title: '先跑通，再理解工具。', note: '从能描述清楚的小任务开始，找到适合自己的操作入口。', modules: [ ['基础入门', '认识 Codex、任务输入与结果检查。'], ['桌面端主线', '在桌面工作区中阅读、修改和检查文件。'], ['CLI 与 IDE', '了解终端与编辑器里的工作方式。'] ] },
  { id: 'workflow', number: '02', label: '组织工作流', title: '让每次任务都有上下文。', note: '把协作、配置和工具连接起来，减少重复解释与操作。', modules: [ ['云端协作', '理解云端任务与本地工作的衔接。'], ['Agent 工作流', '拆分目标、控制范围、逐步交付。'], ['配置与权限', '明确工作环境、可做的事与权限边界。'], ['Skills 与 MCP', '组织可复用能力，连接需要的工具。'] ] },
  { id: 'delivery', number: '03', label: '稳定交付', title: '从做出结果，到交付结果。', note: '让协作与自动化有规则，让每次修改都有检查依据。', modules: [ ['工程协作', '用清晰的变更和验收条件一起工作。'], ['自动化与 SDK', '理解重复任务的自动化入口。'], ['安全治理', '处理敏感信息、权限和交付边界。'] ] },
  { id: 'reference', number: '04', label: '随时查阅', title: '遇到问题，再回来找答案。', note: '不必记住每个概念；保留一份可随时打开的索引。', modules: [ ['速查表', '快速回顾常用操作与检查项。'], ['FAQ 与词典', '查找常见问题与术语解释。'] ] },
];

export function learnPage() {
  return `<div class="detail-page detail-learning">
    <section class="detail-hero" aria-labelledby="detail-learn-title">
      <div><p class="detail-eyebrow">Codex 实战教室</p><h1 id="detail-learn-title">从第一条任务，<br>走向自己的<br><em>工作系统。</em></h1><p class="detail-lead">60 篇中文教程，12 个学习部分。跟着具体任务学习，把提示词、操作步骤和验收方法一起带走。</p><div class="detail-actions"><a class="detail-button" href="${firstLesson}">阅读第 01 课 ↗</a><a class="detail-text-link" href="#detail-directory">查看学习路线 ↓</a></div></div>
      <aside class="detail-start" aria-label="第一次练习建议"><p class="detail-eyebrow">今天就能开始</p><h2>给自己一个<br>足够小的任务。</h2><p>选择一个可回滚的文件，说明目标和验收条件。先阅读改动，再决定是否保留。</p><div class="detail-prompt"><span>任务描述示例</span><p>请先阅读当前项目，说明结构。暂时不要修改文件，给我一个最小改动建议和对应的验收步骤。</p></div><p class="detail-start-note">这是起步提示词示例。实际结果取决于你的项目与环境。</p></aside>
    </section>
    <nav class="detail-route-nav" aria-label="学习阶段">${stages.map(stage => `<a href="#detail-${stage.id}"><span>${stage.number}</span>${stage.label}<b aria-hidden="true">↘</b></a>`).join('')}</nav>
    <section class="detail-directory" id="detail-directory" aria-labelledby="detail-directory-title"><div class="detail-section-heading"><p class="detail-eyebrow">完整学习路线</p><h2 id="detail-directory-title">四个阶段，循序展开。</h2><p>这里按学习目标组织 12 个部分。完整课文与课程目录在现有 Codex 学习站阅读。</p></div>
      ${stages.map(stage => `<section class="detail-stage" id="detail-${stage.id}" aria-labelledby="detail-heading-${stage.id}"><div class="detail-stage-intro"><p class="detail-stage-number">${stage.number} <span>/ ${stage.label}</span></p><h3 id="detail-heading-${stage.id}">${stage.title}</h3><p>${stage.note}</p></div><ul class="detail-module-list">${stage.modules.map(([name, note]) => `<li><h4>${name}</h4><p>${note}</p></li>`).join('')}</ul></section>`).join('')}
    </section>
    <section class="detail-bottom-cta"><div><p class="detail-eyebrow">让学习发生在行动里</p><h2>找到一个问题，<br>完成一次练习。</h2></div><div><p>已经有明确方向？打开完整学习站，按课程目录选择当前需要的内容。</p><a class="detail-button" href="${studio}">打开完整课程目录 ↗</a></div></section>
  </div>`;
}

export function aboutPage() {
  return `<div class="detail-page detail-about">
    <section class="detail-about-hero" aria-labelledby="detail-about-title"><div><p class="detail-eyebrow">马智辰 · AI拾金术主理人</p><h1 id="detail-about-title">保持好奇，<br>把探索变成<br><em>可执行的步骤。</em></h1><p class="detail-lead">我是智辰老师。我把 AI 工具、信息和市场机会拆开研究，再整理成能够动手实践的流程。</p></div><aside class="detail-author-note"><span class="detail-signature">智辰</span><p>方法值得分享，<br>结果需要证据。</p><div class="detail-author-rule"></div><p class="detail-muted">从教程到作品，从一次尝试到可复用的经验，持续公开探索的过程与边界。</p></aside></section>
    <section class="detail-approach" aria-labelledby="detail-approach-title"><div class="detail-section-heading"><p class="detail-eyebrow">我关心的事情</p><h2 id="detail-approach-title">把一次经验，<br>变成下一次的起点。</h2></div><div class="detail-approach-list"><article><span>研究</span><h3>先理解问题</h3><p>保留信息来源、判断依据与反例，说明方法在什么条件下成立。</p></article><article><span>实践</span><h3>再完成一个结果</h3><p>把目标拆成具体输入、操作步骤和验收条件，让探索有可见的落点。</p></article><article><span>复用</span><h3>最后留下可用的资产</h3><p>将可重复的方法整理成教程、提示词和流程，让下一次开始得更容易。</p></article></div></section>
    <section class="detail-work" aria-labelledby="detail-work-title"><div><p class="detail-eyebrow">从作品认识我</p><h2 id="detail-work-title">先看看，<br>这里已经做了什么。</h2></div><div class="detail-work-list"><a href="?view=learn"><span class="detail-work-type">中文教程 / 学习路线</span><h3>Codex 实战教室 <span aria-hidden="true">↗</span></h3><p>60 篇教程、12 个部分，从基础任务到团队治理；每课配有提示词与验收清单。</p></a><a href="https://aipickgold.com/games/void-expedition/"><span class="detail-work-type">交互作品 / 游戏试玩</span><h3>虚空远征 <span aria-hidden="true">↗</span></h3><p>打开一个可以直接体验的作品，感受从想法到可玩结果的另一种表达。</p></a></div></section>
    <section class="detail-boundaries" aria-labelledby="detail-boundaries-title"><p class="detail-eyebrow">内容与实践边界</p><h2 id="detail-boundaries-title">讲清方法，<br>也讲清它的条件。</h2><div class="detail-boundary-grid"><div><h3>你会看到</h3><p>AI 工作流、内容资产、Codex 教程和个人 IP 实验；可复制输入、具体步骤、可见结果与必要排错。</p></div><div><h3>我坚持说明</h3><p>事实与假设、适用条件、反例和风险。机会研究不荐股、不承诺收益，不用虚构案例或增长数据替代证据。</p></div></div></section>
    <section class="detail-bottom-cta"><div><p class="detail-eyebrow">从一个小问题开始</p><h2>一起探索，<br>也一起动手。</h2></div><div><p>如果你想把 AI 用进日常工作，可以从第一条学习路径开始。</p><a class="detail-button" href="?view=learn">前往学习地图 ↗</a></div></section>
  </div>`;
}
