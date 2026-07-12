export type GameStatus = 'coming-soon' | 'playable';

export interface Game {
  id: string;
  title: string;
  status: GameStatus;
  description: string;
  playUrl: string | null;
}
