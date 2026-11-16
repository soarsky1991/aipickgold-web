import { learnPage, aboutPage } from './pages.js';
const views = {
  home: ['首页', '主张与内容入口'],
  learn: ['学习', '60 篇 Codex 教程'],
  about: ['关于', '智辰与方法边界'],
};

const href = view => `?view=${view}`;

function header(view) {
  return `<header class="site-header">
    <a class="brand" href="${href('home')}" aria-label="AI拾金术首页"><span aria-hidden="true">◆</span> AI拾金术</a>
    <nav aria-label="主要页面"><ul>
      ${Object.entries(views).map(([id, [label]]) => `<li><a href="${href(id)}"${id === view ? ' aria-current="page"' : ''}>${label}</a></li>`).join('')}
    </ul></nav>
    <a class="primary-link" href="${href('learn')}">开始学习</a>
  </header>`;
}

function homePage() {
  return `<section class="hero hero-home"><div><p class="kicker">智辰的 AI 实践与学习空间</p><h1><span>探索 AI，</span><span>把想法</span><span>做成结果。</span></h1><p class="lede">从一条 Codex 任务开始，把研究、创作与自动化连成自己的工作流程。</p><div class="actions"><a class="button" href="${href('learn')}">开始第一条学习路径 ↗</a><a class="quiet-link" href="#learning-paths">看看这里有什么 ↓</a></div><p class="hero-footnote">方法 · 实例 · 可复用的步骤</p></div>${ecosystem()}</section>
  <section class="galaxy-proof" aria-label="公开学习资产"><p>从探索，到动手。</p><div><strong>60</strong><span>篇 Codex 教程</span></div><div><strong>12</strong><span>个学习部分</span></div><div><strong>每一课</strong><span>提示词与验收清单</span></div></section>
  <section class="learning-paths" id="learning-paths"><div class="section-heading"><p class="section-label">选择你的起点</p><h2>沿着问题，找到路径。</h2><p>不必先了解所有工具。选一个当下需要，完成一个具体结果。</p></div><div class="learning-grid">
    <a href="${href('learn')}"><span class="path-index">01 / 学习</span><h3>让 Codex<br>完成第一条任务</h3><p>从基础入门到规则与协作，按自己的节奏建立工作方法。</p><span class="path-action">进入学习地图 ↗</span></a>
    <a href="https://aipickgold.com/aipickgold-studio/"><span class="path-index">02 / 实践</span><h3>把一次操作<br>沉淀成工作流</h3><p>从现有教程中找到可复制的输入、执行步骤与验收方式。</p><span class="path-action">打开实战教室 ↗</span></a>
    <a href="https://aipickgold.com/games/void-expedition/"><span class="path-index">03 / 体验</span><h3>先玩一个<br>真实交互作品</h3><p>进入《虚空远征》，从可玩的结果认识网站里的创作实践。</p><span class="path-action">开始游戏试玩 ↗</span></a>
  </div></section>
  <section class="editorial-feature"><div><p class="section-label">持续公开的作品</p><h2>一套教程，<br>一条完整的学习线。</h2><p>Codex 实战教室覆盖基础任务、工具使用、工程协作与团队治理。每课都面向一个具体的使用场景。</p><a class="text-link" href="${href('learn')}">浏览 12 个学习部分 ↗</a></div><ol class="curriculum-preview"><li><span>起步</span><strong>从第一条任务建立信心</strong></li><li><span>进阶</span><strong>把工具接入日常工作</strong></li><li><span>协作</span><strong>用规则与验收交付结果</strong></li></ol></section>
  <section class="founder-invitation"><div><p class="section-label">关于智辰</p><h2>保持好奇，<br>也保留证据。</h2></div><div><p>我是智辰，AI拾金术主理人。我把信息、工具和机会拆成可以执行的步骤，公开方法、反例与适用边界。</p><p>机会研究不荐股、不承诺收益。先看真实作品，再决定是否一起探索。</p><a class="text-link" href="${href('about')}">了解主理人与实践 ↗</a></div></section>`;
}

function ecosystem() {
  const nodes = [
    ['codex', 'Codex', '学习'], ['workflow', 'AI 内容', '工作流'],
    ['reuse', '跨平台', '复用'], ['research', '机会', '研究'], ['founder', '主理人', '实践'],
  ];
  return `<aside class="ecosystem" aria-label="AI拾金术内容生态">
    <div class="ecosystem-board">
      <div class="ecosystem-stage" id="ecosystem-stage">
        <canvas id="ecosystem-canvas" aria-hidden="true"></canvas><div class="galaxy-landmarks" aria-hidden="true"></div>
        <p class="galaxy-caption">AI拾金术 · 内容星系</p>
        <div class="ecosystem-controls"><button id="ecosystem-motion" class="ecosystem-motion" type="button">暂停旋转</button><button id="ecosystem-zoom" class="ecosystem-motion" type="button">靠近观察</button><button id="ecosystem-reset" class="ecosystem-motion" type="button">恢复视角</button></div>
        <span class="galaxy-status" id="galaxy-status">缓慢旋转中</span><p class="ecosystem-fallback">3D 动画暂不可用，以下入口仍可浏览</p>
      </div>
      <div class="ecosystem-nodes" role="group" aria-label="选择一个内容入口">
        ${nodes.map(([id, first, second]) => `<button class="ecosystem-node" type="button" data-node="${id}" aria-pressed="false">${first}<br>${second}</button>`).join('')}
      </div>
    </div>
    <div class="ecosystem-detail" aria-live="polite">
      <button id="ecosystem-close" type="button" hidden aria-label="关闭详情">×</button><p class="section-label">选择一颗星，找到你的起点</p>
      <h2 id="ecosystem-title">探索内容星系</h2>
      <p id="ecosystem-description">拖动星系改变视角，点击地标或下方入口查看内容。触屏可横向拖动，上下滑动浏览页面。</p>
      <a id="ecosystem-link" hidden href="${href('learn')}">进入学习地图 ↗</a>
    </div>
  </aside>`;
}

function footer() {
  return `<footer><p>AI拾金术 · 用流程和证据，把 AI 变成可执行结果。</p><div><a href="https://aipickgold.com/aipickgold-studio/">Codex 实战教室</a><a href="./games.html">游戏作品</a><a href="https://github.com/soarsky1991">GitHub</a></div></footer>`;
}

export function renderSite(search = '') {
  const requested = new URLSearchParams(search).get('view');
  const view = Object.hasOwn(views, requested) ? requested : 'home';
  const content = view === 'home' ? homePage() : view === 'learn' ? learnPage() : aboutPage();
  return { view, title: `${views[view][0]} | AI拾金术`, html: `${header(view)}<main id="main">${content}</main>${footer()}` };
}
