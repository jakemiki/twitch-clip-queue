import TwitchApi from "../services/TwitchApi";
import { createPersistentState } from "./helpers";

const gamesDictionary = createPersistentState('gamesDictionary', {} as Record<string, string>);

export const getGameName = async (id: string): Promise<string> => {
  const dict = gamesDictionary.get();
  if (dict[id]) {
    return dict[id];
  }

  const game = await TwitchApi.getGame(id);

  if (game) {
    gamesDictionary.set(d => ({ ...d, [id]: game.name }));
    return game.name;
  }

  return '';
};
