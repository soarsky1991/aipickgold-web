import type { Game } from './types';

const manifestPath = `${import.meta.env.BASE_URL}games.json`;

export async function loadGames(): Promise<Game[]> {
  const response = await fetch(manifestPath);

  if (!response.ok) {
    throw new Error(`Could not load the game manifest (${response.status}).`);
  }

  const games: unknown = await response.json();

  if (!Array.isArray(games)) {
    throw new Error('The game manifest must contain an array.');
  }

  return games as Game[];
}

export function findGame(games: Game[], id: string | null): Game | undefined {
  return games.find((game) => game.id === id);
}
