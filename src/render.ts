import type { Game } from './types';

const basePath = import.meta.env.BASE_URL;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function statusLabel(game: Game): string {
  return game.status === 'playable' ? 'Play now' : 'Coming soon';
}

function plushIllustration(label: string, size = 'card'): string {
  return `<svg class="plush-art plush-art--${size}" viewBox="0 0 520 360" role="img" aria-label="${escapeHtml(label)} placeholder illustration" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="plush-sky" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#f8d8b0" />
        <stop offset="1" stop-color="#d8d5f5" />
      </linearGradient>
      <linearGradient id="plush-body" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#ffd2a9" />
        <stop offset="1" stop-color="#f39e99" />
      </linearGradient>
    </defs>
    <rect width="520" height="360" rx="34" fill="url(#plush-sky)" />
    <circle cx="95" cy="82" r="42" fill="#fff5d6" opacity=".62" />
    <circle cx="438" cy="90" r="58" fill="#fff5d6" opacity=".46" />
    <path d="M46 285c92-42 134-32 213 4 79 36 132 36 215-7v78H46z" fill="#b9d8c5" opacity=".8" />
    <path d="M182 194c-11-55 17-106 79-111 63-5 104 40 91 103 38 13 56 44 48 82-9 41-47 56-96 54h-93c-51 2-84-17-90-55-7-35 15-63 61-73Z" fill="url(#plush-body)" stroke="#a75f67" stroke-width="6" />
    <path d="M205 109c-9-34 14-64 36-38 19-31 57-12 44 25 31-13 53 18 26 40-28 19-88 18-106-27Z" fill="#c9b8ed" stroke="#8e79bc" stroke-width="6" />
    <circle cx="244" cy="182" r="9" fill="#453d4d" />
    <circle cx="326" cy="182" r="9" fill="#453d4d" />
    <path d="M269 208c13 14 27 14 40 0" fill="none" stroke="#453d4d" stroke-linecap="round" stroke-width="6" />
    <path d="M234 215c-21-9-38 9-25 22 13 13 29-2 25-22Zm103 0c21-9 38 9 25 22-13 13-29-2-25-22Z" fill="#fff5d6" opacity=".7" />
    <circle cx="141" cy="146" r="8" fill="#fff7ec" />
    <circle cx="391" cy="205" r="10" fill="#fff7ec" />
    <path d="m117 206 10 18 20 4-15 13 3 20-18-10-18 10 3-20-15-13 20-4z" fill="#fff5d6" opacity=".92" />
  </svg>`;
}

function header(): string {
  return `<header class="site-header">
    <a class="brand" href="${basePath}" aria-label="aipickgold home">
      <span class="brand-mark" aria-hidden="true">✦</span>
      <span>aipickgold</span>
    </a>
    <nav class="site-nav" aria-label="Main navigation">
      <a href="${basePath}games.html#games">Games</a>
      <a href="${basePath}?view=about">About</a>
    </nav>
  </header>`;
}

function footer(): string {
  return `<footer class="site-footer">
    <div class="footer-brand">
      <span class="footer-dot" aria-hidden="true"></span>
      <span>aipickgold</span>
    </div>
    <div class="footer-meta">
      <a href="mailto:mahaochen2018@hotmail.com">Say hello</a>
      <span aria-hidden="true">·</span>
      <span>(c) 2026 aipickgold</span>
    </div>
  </footer>`;
}

function layout(content: string): string {
  return `${header()}<main>${content}</main>${footer()}`;
}

function gameHref(game: Game): string {
  return `${basePath}game.html?id=${encodeURIComponent(game.id)}`;
}

function gameCard(game: Game): string {
  return `<article class="game-card">
    <a class="game-card__visual" href="${gameHref(game)}" aria-label="View ${escapeHtml(game.title)}">
      ${plushIllustration(`${game.title} artwork`)}
      <span class="status-pill">${statusLabel(game)}</span>
    </a>
    <div class="game-card__body">
      <div>
        <p class="eyebrow">${game.status === 'playable' ? 'Browser game' : 'In the soft launch queue'}</p>
        <h3><a href="${gameHref(game)}">${escapeHtml(game.title)}</a></h3>
      </div>
      <p>${escapeHtml(game.description)}</p>
      <a class="text-link" href="${gameHref(game)}">${game.status === 'playable' ? 'Play the game' : 'Peek inside'} <span aria-hidden="true">↗</span></a>
    </div>
  </article>`;
}

function homeContent(games: Game[]): string {
  return `<section class="hero section-wrap" aria-labelledby="hero-title">
    <div class="hero__copy">
      <p class="eyebrow eyebrow--accent"><span class="eyebrow-dot" aria-hidden="true"></span> Indie studio · made for slow smiles</p>
      <h1 id="hero-title">Tiny worlds,<br /><em>plush feelings.</em></h1>
      <p class="hero__lede">aipickgold makes cozy little games with generous joy — easy to pick up, lovely to linger in.</p>
      <div class="hero__actions">
        <a class="button button--primary" href="#games">Explore our games <span aria-hidden="true">↓</span></a>
        <span class="hero__note">No high scores required.</span>
      </div>
    </div>
    <div class="hero__art" aria-label="A smiling plush character placeholder illustration">
      ${plushIllustration('A smiling plush character', 'hero')}
      <div class="art-note art-note--top"><span>soft launch</span><span>✦</span></div>
      <div class="art-note art-note--bottom"><span>made with care</span><span>♥</span></div>
    </div>
  </section>

  <section class="marquee-band" aria-label="Studio values">
    <div class="marquee-track"><span>small games</span><b>✦</b><span>soft landings</span><b>✦</b><span>big smiles</span><b>✦</b><span>small games</span><b>✦</b><span>soft landings</span><b>✦</b><span>big smiles</span></div>
  </section>

  <section class="section-wrap games-section" id="games" aria-labelledby="games-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow">The tiny portfolio</p>
        <h2 id="games-title">Games to get comfy with</h2>
      </div>
      <p class="section-heading__aside">A growing shelf of playful experiments, made for a quick break or a long little session.</p>
    </div>
    <div class="game-grid">${games.map(gameCard).join('')}</div>
  </section>

  <section class="about-panel section-wrap" id="about" aria-labelledby="about-title">
    <div class="about-panel__shape" aria-hidden="true"><span>✦</span></div>
    <div>
      <p class="eyebrow">A note from the studio</p>
      <h2 id="about-title">Good games can feel like a warm blanket.</h2>
      <p>We make gentle, tactile games for players everywhere — the kind that leave a little more light in the room than they found.</p>
    </div>
    <span class="about-panel__signature">— aipickgold</span>
  </section>`;
}

function playArea(game: Game): string {
  if (game.playUrl && game.status === 'playable') {
    return `<div class="play-frame">
      <iframe src="${escapeHtml(game.playUrl)}" title="Play ${escapeHtml(game.title)}" loading="lazy" allow="fullscreen"></iframe>
    </div>`;
  }

  return `<div class="play-frame play-frame--placeholder" role="status" aria-live="polite">
    <div class="placeholder-card">
      <div class="placeholder-card__icon" aria-hidden="true">✦</div>
      <p class="eyebrow eyebrow--accent">A little patience, please</p>
      <h2>Coming soon</h2>
      <p>We are still fluffing the corners. This play slot will open as soon as the game is ready.</p>
      <span class="placeholder-card__caption">Play window reserved for ${escapeHtml(game.title)}</span>
    </div>
  </div>`;
}

function gameContent(game: Game, otherGames: Game[]): string {
  const playableLabel = game.status === 'playable' ? 'Play now' : 'Coming soon';

  return `<section class="game-hero section-wrap" aria-labelledby="game-title">
    <a class="back-link" href="${basePath}games.html"><span aria-hidden="true">←</span> Back to all games</a>
    <div class="game-hero__heading">
      <div>
        <p class="eyebrow eyebrow--accent"><span class="eyebrow-dot" aria-hidden="true"></span> ${playableLabel}</p>
        <h1 id="game-title">${escapeHtml(game.title)}</h1>
        <p class="game-hero__description">${escapeHtml(game.description)}</p>
      </div>
      <div class="game-hero__stamp" aria-hidden="true"><span>✦</span><small>soft<br />inside</small></div>
    </div>
  </section>

  <section class="play-section section-wrap" aria-labelledby="play-title">
    <div class="section-heading section-heading--compact">
      <div>
        <p class="eyebrow">The play space</p>
        <h2 id="play-title">Take it for a spin</h2>
      </div>
      <p class="section-heading__aside">Made for mouse, touch, and a few quiet minutes.</p>
    </div>
    ${playArea(game)}
  </section>

  <section class="game-info section-wrap" aria-label="Game information">
    <div class="info-card">
      <p class="eyebrow">How to play</p>
      <h2>Simple controls, soft landings.</h2>
      <p>Use your mouse or finger to interact with the game area. The full control guide will appear here when the first playable build arrives.</p>
      <div class="control-row"><span class="control-key">Mouse / touch</span><span>Interact with the toys</span></div>
    </div>
    <div class="info-card info-card--lavender" id="platform-links">
      <p class="eyebrow">Find it elsewhere</p>
      <h2>Play on CrazyGames / Poki</h2>
      <p>This platform link is a placeholder and will be filled in when the game is published.</p>
      <a class="button button--outline placeholder-link" href="#platform-links" aria-label="CrazyGames or Poki link placeholder">Platform link coming later <span aria-hidden="true">↗</span></a>
    </div>
  </section>

  ${otherGames.length > 0 ? `<section class="more-games section-wrap" aria-labelledby="more-games-title">
    <div class="section-heading section-heading--compact">
      <div><p class="eyebrow">Keep wandering</p><h2 id="more-games-title">More from aipickgold</h2></div>
    </div>
    <div class="game-grid game-grid--compact">${otherGames.map(gameCard).join('')}</div>
  </section>` : ''}`;
}

function errorContent(message: string): string {
  return `<section class="empty-state section-wrap" aria-labelledby="empty-title">
    <div class="empty-state__icon" aria-hidden="true">?</div>
    <p class="eyebrow">Oops, soft detour</p>
    <h1 id="empty-title">We couldn't find that game.</h1>
    <p>${escapeHtml(message)}</p>
    <a class="button button--primary" href="${basePath}">Back to the portfolio <span aria-hidden="true">↗</span></a>
  </section>`;
}

export function renderHome(games: Game[]): void {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = layout(homeContent(games));
}

export function renderGame(game: Game | undefined, games: Game[]): void {
  const content = game
    ? gameContent(game, games.filter((candidate) => candidate.id !== game.id))
    : errorContent('Try heading back to the portfolio and choosing one of the games on the shelf.');

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = layout(content);
}

export function renderLoadError(): void {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = layout(
    errorContent('The game shelf is taking a tiny nap. Please refresh and try again.'),
  );
}
