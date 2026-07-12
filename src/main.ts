import './styles.css';
import { findGame, loadGames } from './data';
import { renderGame, renderHome, renderLoadError } from './render';

function updatePageMetadata(title: string, description: string): void {
  document.title = title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', window.location.href);
}

async function start(): Promise<void> {
  try {
    const games = await loadGames();
    const isGamePage = window.location.pathname.endsWith('/game.html') || window.location.pathname.endsWith('/game');

    if (isGamePage) {
      const id = new URLSearchParams(window.location.search).get('id');
      const game = findGame(games, id);
      renderGame(game, games);

      if (game) {
        updatePageMetadata(`${game.title} | aipickgold`, `${game.description} Play page from aipickgold.`);
      } else {
        updatePageMetadata('Game not found | aipickgold', 'This aipickgold game page could not be found.');
      }
      return;
    }

    renderHome(games);
    updatePageMetadata('aipickgold — Cozy games, big smiles', 'aipickgold makes cozy little games with generous joy. Discover the studio\'s playful portfolio.');
  } catch (error) {
    console.error(error);
    renderLoadError();
    updatePageMetadata('aipickgold — Temporarily fluffy', 'The aipickgold game shelf is temporarily unavailable.');
  }
}

void start();
